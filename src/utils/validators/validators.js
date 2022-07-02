export const Validators = {
    required: (errorMessage)=> {
        try{
            return function(value){
                if(!value || (typeof value === 'string' && value.trim().length === 0)){
                    return {required: true, message: errorMessage || 'The field is required'};
                }
                return null;
            }
        }catch(e){
            console.error(e);
        }
    },
    minLength: (limit, errorMessage)=>{
        try{
            if(limit < 0) throw Error('minLength cannot be set to negative number');
            if(typeof limit !== 'number') throw Error('invalid value set to minLength');
            return function(value){
                if(!(typeof limit === 'number' && typeof value === 'string' && value.length >= limit)){
                    return {minLength: true, message: errorMessage || `The field must be at least ${limit} characters`}
                }
                return null;
            }
        }catch(e){
            console.error(e);
        }
    },
    maxLength: (limit, errorMessage)=>{
        try{
            if(limit < 0) throw new Error('maxLength cannot be set to negative number');
            if(typeof limit !== 'number') throw new Error('invalid value set to maxLength');
            return function(value){
                if(!(typeof limit === 'number' && typeof value === 'string' && value.length <= limit)){
                    return {maxLength: true, message: errorMessage || `The field must be at most ${limit} characters`}
                }
                return null;
            }
        }catch(e){
            console.error(e);
        }
    },
    pattern: (pattern, errorMessage)=>{
        if(!(pattern instanceof RegExp)) throw new Error('pattern must be of the type RegExp');
        return function(value){
            if(!pattern.test(value)){
                return {pattern: true, message: errorMessage || 'Invalid Field'}
            }
            return null;
        }
    }
}
export const checkValidity = (value, validators)=>{
    if(validators?.length > 0){
        const errors = [];
        validators.forEach((validator)=>{
            const validity = validate(value, validator);
            if(validity) {
                errors.push(validity);
            }
        });
        return errors;
    }
    return null;
}
const validate=(value, validatorFunction)=>{
    return validatorFunction(value);
}