export function myPrintLog(message: string) {
  return function (target: Object, propertyName: string, descriptor: PropertyDescriptor) {
    // Store Original Method Impleentation
    const originalMethod = descriptor.value;

    // Now, over-write the original method
    descriptor.value = function (...args: string[]) {
      const result = originalMethod.apply(this, args);
      message = message ? message : `-- ${propertyName}() returned: `;
      console.log(message, result); // Execute custom logic
      return result;
    };
    return descriptor;
  };
}
