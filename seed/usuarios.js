import bcrypt from 'bcrypt';

const usuarios=[
    {
        nombre:'Irene',
        email:'irene@irene.es',
        confirmado:1,
        password:bcrypt.hashSync('123456',10)
    }
];

export default usuarios;