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
    const {formData, register, isFormValid, validateForm} = useForm([
        {control: 'name', validators: [Validators.required(), Validators.minLength(4)] },
        {control: 'address', validators: [Validators.required()] }    
    ]);
   
    const submitForm = () => {
        validateForm();
    }
    useEffect(()=>{
        console.log("Form Valid:",isFormValid());
    }, [formData.name, formData.address, isFormValid]);
    
    return (
        <div>
            <p>Time: {time} </p>
            <FormInput label='Names' {...register('name')} showError={formData.name?.errors}/>
            <FormInput label='Address' {...register('address')} showError={formData.address?.errors}/>
            <button onClick={submitForm}>Validate</button>
            <button onClick={()=> console.log(formData)}>Form Data</button>
            <button onClick={()=> setTime(Date.now())}>Change State</button>
        </div>
    );
}

const FormInput = ({ label, showError, required, description, onChange, onBlur, type, value, placeholder, disabled }) =>{

    return (
        <FieldWrapper label={label} showError={showError} required={required} description={description}>
            <input 
                type={type} 
                value={value || ''} 
                placeholder={placeholder} 
                onChange={onChange} 
                onBlur={onBlur}
                className={`${styles.kycInput} ${showError ? styles.kycInputError:''}`} 
                // maxLength={maxLength} 
                disabled={disabled}
            />
        </FieldWrapper>
    );
}

const useForm = (formFields) => {
    const [formData, setFormData] = useState({});
    useEffect(()=>{
        const formObject = {};
        formFields.forEach(field => {
            if(field['control']){
                formObject[field['control']] = {
                    value: undefined,
                    valid: false,
                    touched: false,
                    errors: null,
                    validators: field.validators,
                    validate(){
                        return _checkErrors(field, this.value);
                    },
                    onChange(event){
                        const {target} = event;
                        const errors = _checkErrors(field, target.value);
                        setFormData((prev)=>{
                            const prevClone = Object.assign({}, prev);
                            const control = prevClone[field['control']];
                            if(control.touched){
                                control.errors = errors;
                            } 
                            control.valid = !errors;
                            control.value = target.value;
                            return prevClone;
                        });
                    },
                    onBlur(event){
                        const {target} = event;
                        const errors = _checkErrors(field, target.value);
                        setFormData((prev)=>{
                            const prevClone = Object.assign({}, prev);
                            const control = prevClone[field['control']];
                            control.touched = true;
                            control.errors = errors;
                            control.valid = !errors;
                            control.value = target.value;
                            return prevClone;
                        });
                    },
                }
            }
        });
        setFormData(formObject);
    }, []);

    const isFormValid = useCallback(()=>{
        return !Object.keys(formData).some( key=> !formData[key].valid);
    }, [formData]);

    const validateForm = () => {
        const formDataCopy = Object.assign({}, formData);
        Object.keys(formDataCopy).forEach(key => {
            const field = formDataCopy[key];
            field.errors = field.validate();
            field.touched = true;
        });
        setFormData(formDataCopy);
    }

    const register = (control)=>{
        return !formData[control]? {
            value: '',
            onChange: ()=>{},
            onBlur: ()=>{}
        } : {
            value: formData[control].value,
            onChange: formData[control].onChange,
            onBlur: formData[control].onBlur
        }
    }
    return {formData, register, isFormValid, validateForm};
}