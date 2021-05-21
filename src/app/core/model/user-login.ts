export class UserLogin {
    userName: string;
    password: string;

    static toFormData(userLogin: UserLogin): FormData {
        const formData: FormData = new FormData();
        if (userLogin.userName) formData.append('userName', userLogin.userName);
        if (userLogin.password) formData.append('password', userLogin.password);
        // if (userLogin.recaptcha_v3) formData.append('recaptcha_v3', userLogin.recaptcha_v3);
        return formData;
    }
}

export class ApiResponse {
  count: number;
  data: any;
  status: string;
  message: any;
}
