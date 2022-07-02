// import { useEffect, useState } from 'react';
import styles from './FieldError.module.scss';

export const FieldError = ({showError, ...props}) =>{
    // const [showError, setShowError] = useState(false);

    // useEffect(()=>{
    //     console.log('Effect called');
    //     const timerId = setInterval(()=>{
    //         setShowError((prev)=> !prev);
    //     }, 2000);
    //     return function cleanup() {
    //         clearInterval(timerId);
    //     };
    // },[]);
    
    return (
        <div className={styles.fieldErrorContainer}>
            <label className={(showError)? styles.showError : ''}>{props.children}</label>
        </div>
    );
}