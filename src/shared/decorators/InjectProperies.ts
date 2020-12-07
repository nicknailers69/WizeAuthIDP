export function InjectProperty(dependencyId: string): Function {
    // Returns a function that is invoked for the property that is to be injected.
    return (prototype: any, propertyName: string): void => {
        if (!prototype.__injections__) {
            // Record properties to be injected against the constructor prototype.
            prototype.__injections__ = [];
        }

        // Record injections to be resolved later when an instance is created.
        prototype.__injections__.push([ propertyName, dependencyId ]);
    };
}