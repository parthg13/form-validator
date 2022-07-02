import { useCallback, useEffect, useState } from "react";
import { Validators } from "../../utils/validators/validators";
import { FieldWrapper } from "../FieldWrapper/FieldWrapper";
import styles from './Input.module.scss';

const _checkErrors = (field, value) => {
    try{
        const { validators } = field;
        const errors = [];
        if(validators && validators.length > 0){
            validators.forEach((validator)=>{
                const validity = _checkValidity(value, validator);
                if(validity) {
                    errors.push(validity);
                }
            });
        }
        return errors.length ? errors : null;
    } catch (e) {
        return null;
    }
}
const _checkValidity = (value, _validatorFunction) => {
    return _validatorFunction(value);
}

export const InputPage = ({type, value, placeholder, disabled}) =>{
    console.log('INput Page rerendered');
    const [time, setTime] = useState(Date.now());
    const [formData, isErrorPresent, onBlurs] = useForm([
        {control: 'name', validators: [Validators.required(), Validators.minLength(4)] },
        {control: 'address', validators: [Validators.required()] }    
    ]);
    const inputChange = (e, key) =>{
        // formData.current[key] = e.target.value;
    }
    useEffect(()=>{
        console.log("Form Error present:",isErrorPresent());
    }, [formData.name, formData.address, isErrorPresent]);
    return (
        <div>
            <p>Time: {time} </p>
            <FormInput label='Names'  formControl={formData.name} onChange={(e)=>inputChange(e, 'name')}/>
            <FormInput label='Address' formControl={formData.address} onChange={(e)=>inputChange(e, 'address')}/>
            <button onClick={()=> console.log(formData)}>Form Data</button>
            <button onClick={()=> setTime(Date.now())}>Change State</button>
        </div>
    );
}

const FormInput = ({ formControl, label, required, description, onChange, type, value, placeholder, disabled }) =>{
    const [showError, setShowError] = useState(false);
    
    const inputChange = (e) =>{
        console.log('formControl:',formControl);
        if(formControl){
            const errors = formControl.setValue(e.target.value);
            if(formControl.touched){
                setShowError(errors);
            }
        }
        onChange(e);
    }
    const onInputBlur = (e) =>{
        formControl.setTouched();
        if(formControl){
            setShowError(formControl.validate(e.target.value));
        }
    }

    return (
        <FieldWrapper label={label} showError={showError} required={required} description={description}>
            <input 
                type={type} 
                value={(formControl && formControl.value) || ''} 
                placeholder={placeholder} 
                onChange={inputChange} 
                onBlur={onInputBlur}
                className={`${styles.kycInput} ${showError ? styles.kycInputError:''}`} 
                // maxLength={maxLength} 
                disabled={disabled}
            />
        </FieldWrapper>
    );
}

const useForm = (formFields) => {
    console.log('Use form called');
    const [formData, setFormData] = useState({});
    useEffect(()=>{
        console.log('Use form useEffect called');
        const formObject = {};
        formFields.forEach(field => {
            if(field['control']){
                formObject[field['control']] = {
                    value: undefined,
                    valid: false,
                    touched: false,
                    // dirty: false,
                    errors: null,
                    validators: field.validators,
                    setValue(val){
                        console.log('this.value:', this.value);
                        const errors = this.validate(val);
                        this.valid = !errors; //// direct assign
                        setFormData((prev)=>{
                            const prevClone = Object.assign({}, prev);
                            const control = prevClone[field['control']];
                            if(control.touched){
                                control.errors = errors;
                            } 
                            control.valid = !errors;
                            control.value = val;
                            return prevClone;
                        });
                        return errors;
                    },
                    setTouched(){
                        setFormData((prev)=>{
                            const prevClone = Object.assign({}, prev);
                            const control = prevClone[field['control']];
                            control.touched = true;
                            return prevClone;
                        });
                    },
                    validate(val){
                        const errors = _checkErrors(field, val);
                        // const valid = errors ? false : true;
                        return errors;
                    },
                }
            }
        });
        setFormData(formObject);
    }, []);
    // 
    const isErrorPresent = useCallback(()=>{
        return Object.keys(formData).some( key=> !formData[key].valid);
    }, [formData]);
    return [formData, isErrorPresent];
}