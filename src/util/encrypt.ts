import bcrypt from 'bcrypt';

/**
 * @description Este metodo es utilizado para enciptar contraseñas
 * @param password Contraseña que se desea encriptar
 * @returns Contraseña encriptada
 */
export const encryptPassword = async (password: string): Promise<string> => {
    try {        
        const encryptedPassword = await bcrypt.hash(password, Number(process.env['SALT_ROUNDS']));
        
        if( !await bcrypt.compare(password,encryptedPassword) ){
            throw new Error('Error al comparar la contraseña')
        }

        return encryptedPassword;
    } catch (err) {
        console.error('Error al encriptar la contraseña:', err);
        throw new Error('Error al encriptar la contraseña');
    }
    
};