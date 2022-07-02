import React from 'react';
import { FieldError } from '../FieldError/FieldError';
import styles from './FieldWrapper.module.scss';

export const FieldWrapper = ({label, required, description, showError, ...props}) =>{
    return (
        <React.Fragment>
            <label className={styles.kycInputLabel}> {required && <span>*</span>}{label}</label>

            {props.children}
            
            {description && <label className={styles.kycInputDescription}>{description}</label>}
            
            <FieldError showError={showError}> {showError && showError[0].message} </FieldError>
        </React.Fragment>
    );
}