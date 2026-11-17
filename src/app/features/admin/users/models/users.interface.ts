import { Roles } from "../../../../shared/models/catalog-tables.interface";

export interface User {
    id: string,
    full_name: string;
    email: string;
    is_active: boolean;
    must_change_password: boolean;
    creation_date: string;
    update_date: string;
    last_login: string;
    role: Roles
};

export interface UserCrUp {
    id: string,
    full_name: string;
    email: string;
    is_active: boolean;
    must_change_password: boolean;
    role: number;
}

export interface UserModel {
    basicInfo: {
        fullName: string;
        email: string;
    };
    accessAndSecurity: {
        role: number | null;
        password: string;
        confirm_password: string;
        is_active: boolean;
        must_change_password: boolean
    };
};

export const userModel = {
    basicInfo: {
        fullName: '',
        email: '',
    },
    accessAndSecurity: {
        role: null,
        password: '',
        confirm_password: '',
        is_active: true,
        must_change_password: true
    }
};