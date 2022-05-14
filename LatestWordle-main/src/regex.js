export const firstNamePattern = new RegExp(
    '^[a-zA-Z]{1,30}$'
 );
 
 export const inputValidPattern = new RegExp(
    '^[a-zA-Z]{1,5}$'
 );

 export const lastNamePattern = new RegExp(
    '^[a-zA-Z]{0,30}$'
 );
 

 export const emailPattern = new RegExp(
    '^[a-z0-9._%+-]{1,50}@[a-z0-9]{1,50}[.][a-z]{2,3}$'
 );

 export const passwordPattern = new RegExp(
   '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$'
 );