export interface Login {
    email:    string;
    password: string;
};

export interface PasswordChange {
    password:         string;
    confirm_password: string;
};

export const loginModel: Login = {
    email: '',
    password: ''
}

export const passwordChangeModel: PasswordChange = {
    password: '',
    confirm_password: ''
}