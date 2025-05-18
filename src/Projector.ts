/* eslint-disable guard-for-in, @typescript-eslint/no-explicit-any */


export type Projection = Record<string, 0 | 1>;

type TrieNode = {
	children: Map<string, TrieNode>;
	isExcluded: boolean;
};


/**
 * A class for projecting objects in MongoDB style.
 * Supports field inclusion/exclusion based on a fixed projection.
 */
export class Projector {
	
	/**
	 * Creates a new MongoProjector instance with a fixed projection.
	 * @param projection The projection object (keys are paths, values are 0 or 1).
	 */
	constructor(projection: Projection) {
		if (projection === null || typeof projection !== "object")
			throw new Error("Projection must be a non-null object");
		
		this.#projection = { ...projection };
		this.#isInclude = this.#isIncludeProjection(this.#projection);
		
		if (!this.#isInclude)
			this.#trie = this.#buildTrie(Object.keys(this.#projection));
		
	}
	
	#projection: Projection;
	#isInclude: boolean;
	#trie: TrieNode | null = null;
	#pathCache = new Map<string, string[]>();
	#maxPathCacheSize = 10000;
	#maxDepth = 100;
	
	/**
	 * Clears the path cache.
	 */
	clearPathCache(): void {
		this.#pathCache.clear();
	}
	
	/**
	 * Applies the projection to an object, returning a new object with selected fields.
	 * @param obj The input object.
	 * @param strict If true, throws errors for inaccessible paths.
	 * @returns The projected object.
	 * @throws Error If the input object is null or not an object, or if strict mode detects issues.
	 */
	project<T extends Record<string, any>>(
		obj: T,
		strict = false
	): Partial<T> {
		
		if (obj === null || typeof obj !== "object")
			throw new Error("Input object must be a non-null object");
		
		if (Object.keys(this.#projection).length === 0)
			return this.#deepCopy(obj, new WeakSet());
		
		const result: Partial<T> & { _id?: any } = Object.create(null);
		
		if (this.#isInclude) {
			for (const key in this.#projection) {
				if (this.#projection[key] !== 1)
					continue;
				const value = this.#getNestedValue(obj, key, strict);
				if (value !== undefined)
					this.#setNestedValue(result, key, value, strict);
				else if (strict)
					throw new Error(`Path "${key}" not found in object: ${JSON.stringify(obj, null, 2)}`);
			}
			
			if (!("_id" in this.#projection) && "_id" in obj)
				result._id = obj._id;
		} else
			this.#deepCopyExcluding(obj, result, [], this.#trie!);
		
		
		return result;
	}
	
	/**
	 * Applies the projection to an array of objects.
	 * @param docs The array of input objects.
	 * @param strict If true, throws errors for inaccessible paths.
	 * @returns An array of projected objects.
	 * @throws Error If the input is not an array.
	 */
	projectMany<T extends Record<string, any>>(
		docs: T[],
		strict = false
	): Partial<T>[] {
		
		if (!Array.isArray(docs))
			throw new Error("Input must be an array of objects");
		
		return docs.map(doc => this.project(doc, strict));
	}
	
	/**
	 * Checks if the projection is an inclusion projection.
	 * @param projection The projection object.
	 * @returns True if the projection includes at least one field (value 1).
	 * @private
	 */
	#isIncludeProjection(projection: Projection): boolean {
		return Object.values(projection).includes(1);
	}
	
	/**
	 * Creates a deep copy of an object, detecting circular references.
	 * @param obj The input object.
	 * @param seen A WeakSet to track visited objects.
	 * @returns The copied object.
	 * @throws Error If a circular reference is detected.
	 * @private
	 */
	#deepCopy<T>(obj: T, seen: WeakSet<object>): T {
		
		if (obj === null || typeof obj !== "object")
			return obj;
		
		if (seen.has(obj as object))
			throw new Error("Circular reference detected in object");
		
		seen.add(obj as object);
		
		if (Array.isArray(obj))
			return obj.map(item => this.#deepCopy(item, seen)) as any;
		
		const result: Record<string, any> = Object.create(null);
		for (const key in obj)
			result[key] = this.#deepCopy(obj[key], seen);
		
		return result as T;
	}
	
	/**
	 * Retrieves a value from an object by path.
	 * @param obj The input object.
	 * @param path The dot-separated path (e.g., "user.address.city").
	 * @param strict If true, throws errors for inaccessible paths.
	 * @returns The value at the path, or undefined if not found.
	 * @throws Error If strict mode is enabled and the path is invalid or depth limit is exceeded.
	 * @private
	 */
	#getNestedValue(
		obj: any,
		path: string,
		strict: boolean
	): any {
		
		const keys = this.#pathCache.get(path) ?? this.#parsePath(path);
		
		this.#pathCache.set(path, keys);
		
		if (this.#pathCache.size > this.#maxPathCacheSize) {
			const oldestKey = this.#pathCache.keys().next().value!;
			this.#pathCache.delete(oldestKey);
		}
		
		let current = obj;
		let depth = 0;
		
		for (const key of keys) {
			if (depth++ > this.#maxDepth)
				throw new Error(`Maximum object depth exceeded at path "${path}"`);
			
			if (current === null || typeof current !== "object") {
				if (strict)
					throw new Error(`Expected object at "${key}" in path "${path}": ${JSON.stringify(current)}`);
				
				return undefined;
			}
			current = current[key];
		}
		
		return current;
	}
	
	/**
	 * Sets a value in an object by path, creating intermediate objects if needed.
	 * @param obj The target object.
	 * @param path The dot-separated path.
	 * @param value The value to set.
	 * @param strict If true, throws errors for invalid paths.
	 * @throws Error If strict mode is enabled and the path is invalid or depth limit is exceeded.
	 * @private
	 */
	#setNestedValue(
		obj: any,
		path: string,
		value: any,
		strict: boolean
	): void {
		
		const keys = this.#pathCache.get(path) ?? this.#parsePath(path);
		
		this.#pathCache.set(path, keys);
		
		if (this.#pathCache.size > this.#maxPathCacheSize) {
			const oldestKey = this.#pathCache.keys().next().value!;
			this.#pathCache.delete(oldestKey);
		}
		
		let current = obj;
		let depth = 0;
		
		for (let i = 0; i < keys.length - 1; i++) {
			if (depth++ > this.#maxDepth)
				throw new Error(`Maximum object depth exceeded at path "${path}"`);
			
			const key = keys[i];
			if (typeof current[key] !== "object" || current[key] === null) {
				if (strict && current[key] !== undefined)
					throw new Error(`Expected object at "${key}" in path "${path}": ${JSON.stringify(current[key])}`);
				
				current[key] = Object.create(null);
			}
			current = current[key];
		}
		current[keys.at(-1)!] = value;
	}
	
	/**
	 * Copies an object, excluding specified paths, using an iterative approach.
	 * @param src The source object.
	 * @param dest The destination object.
	 * @param path The current path as an array of keys.
	 * @param trie The trie for excluded paths.
	 * @throws Error If a circular reference or depth limit is exceeded.
	 * @private
	 */
	#deepCopyExcluding(
		src: any,
		dest: any,
		path: string[],
		trie: TrieNode
	): void {
		
		if (src === null || typeof src !== "object")
			return;
		
		const seen = new WeakSet<object>();
		
		const stack: Array<{
			src: any;
			dest: any;
			path: string[];
			node: TrieNode;
			depth: number;
		}> = [ { src, dest, path, node: trie, depth: 0 } ];
		
		while (stack.length > 0) {
			const { src: currentSrc, dest: currentDest, path: currentPath, node: currentNode, depth } = stack.pop()!;
			
			if (depth > this.#maxDepth)
				throw new Error(`Maximum object depth exceeded at path "${currentPath.join(".")}"`);
			
			if (currentSrc === null || typeof currentSrc !== "object")
				continue;
			if (seen.has(currentSrc))
				throw new Error(`Circular reference detected at path "${currentPath.join(".")}"`);
			
			seen.add(currentSrc);
			
			for (const key in currentSrc) {
				const nextNode = currentNode.children.get(key);
				if (nextNode?.isExcluded)
					continue;
				
				const srcVal = currentSrc[key];
				if (Array.isArray(srcVal))
					currentDest[key] = srcVal.map((item: any) => this.#deepCopy(item, seen));
				else if (typeof srcVal === "object" && srcVal !== null) {
					const childDest = Object.create(null);
					
					if (!nextNode || nextNode.children.size === 0) {
						Object.assign(childDest, this.#deepCopy(srcVal, seen));
						if (Object.keys(childDest).length > 0)
							currentDest[key] = childDest;
					} else {
						stack.push({
							src: srcVal,
							dest: childDest,
							path: [ ...currentPath, key ],
							node: nextNode ?? { children: new Map(), isExcluded: false },
							depth: depth + 1
						});
						if (Object.keys(childDest).length > 0)
							currentDest[key] = childDest;
					}
				} else
					currentDest[key] = srcVal;
				
			}
		}
		
	}
	
	/**
	 * Parses a dot-separated path into an array of keys.
	 * @param path The dot-separated path.
	 * @returns An array of path segments.
	 * @throws Error If the path is invalid (empty, contains brackets, or has empty segments).
	 * @private
	 */
	#parsePath(path: string): string[] {
		if (!path || path.startsWith(".") || path.endsWith("."))
			throw new Error(`Invalid MongoDB projection path: "${path}"`);
		
		const parts = path.split(".");
		
		for (const part of parts) {
			if (part === "")
				throw new Error(`Invalid MongoDB projection path: "${path}"`);
			
			if (part.includes("[") || part.includes("]"))
				throw new Error(`Square brackets are not allowed in MongoDB projection path: "${path}"`);
			
		}
		
		return parts;
	}
	
	/**
	 * Builds a trie for excluded paths.
	 * @param paths An array of paths to exclude.
	 * @returns The root trie node.
	 * @private
	 */
	#buildTrie(paths: string[]): TrieNode {
		
		const root: TrieNode = { children: new Map(), isExcluded: false };
		
		for (const path of paths) {
			const keys = this.#parsePath(path);
			let current = root;
			
			for (const key of keys) {
				if (!current.children.has(key))
					current.children.set(key, { children: new Map(), isExcluded: false });
				
				current = current.children.get(key)!;
			}
			
			current.isExcluded = true;
		}
		
		return root;
	}
}
