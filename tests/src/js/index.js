import imageSrc from "../images/image-dir-test.jpg?url";

console.log("imageSrc:\n", imageSrc);

// Object destructuring with rest properties and nested default values
const testObject = { 
  foo: "bar", 
  baz: "qux", 
  nested: { a: 1, b: 2 } 
};

// This exact pattern (nested destructing + rest) causes issues in older target environments on esbuild
const { 
  foo, 
  nested: { a, ...restNested }, 
  ...rest 
} = testObject;

console.log(foo, a, restNested, rest);

// Parameter destructuring with defaults and rest
function testDestructure({ x = 10, ...y } = {}) {
  console.log(x, y);
}
testDestructure({ x: 20, z: 30, w: 40 });

// Class private fields and methods (ES2022)
class ModernClass {
  #privateField = "secret";

  #privateMethod() {
    return this.#privateField;
  }

  publicMethod() {
    console.log(this.#privateMethod());
  }
}

new ModernClass().publicMethod();

// Top-level await (ES2022 feature)
await Promise.resolve("Top-level await success!").then(console.log);
