"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Validate(params) {
    return (target, propertyKey) => {
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        const originalMethod = descriptor.value;
        descriptor.value = function () {
            const errors = [];
            const body = arguments[0];
            params.forEach((currentParam) => {
                switch (currentParam.validate) {
                    case 'email':
                        const check = new RegExp('\\b[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,4}\\b', 'gi');
                        if (!check.test(body[currentParam.param])) {
                            errors.push(currentParam);
                        }
                        break;
                    case 'required':
                    default:
                        if (currentParam.atomic) {
                            if (!currentParam.param) {
                                errors.push(currentParam);
                            }
                            return;
                        }
                        if (!body[currentParam.param]) {
                            errors.push(currentParam);
                        }
                        break;
                }
            });
            if (errors.length) {
                throw new Error(`Invalid parameters ${JSON.stringify(errors)}`);
            }
            else {
                return originalMethod.apply(this, arguments);
            }
        };
        return descriptor;
    };
}
exports.Validate = Validate;
//# sourceMappingURL=validate.js.map