export const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let remainder = sum % 11;
    let firstDigit = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cpf.charAt(9)) !== firstDigit) {
        return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }

    remainder = sum % 11;
    let secondDigit = remainder < 2 ? 0 : 11 - remainder;

    return parseInt(cpf.charAt(10)) === secondDigit;
};

export const formatCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length > 11) {
        cpf = cpf.substring(0, 11);
    }
    if (cpf.length > 9) {
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
    } else if (cpf.length > 6) {
        return cpf.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
    } else if (cpf.length > 3) {
        return cpf.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
    }
    return cpf;
};
