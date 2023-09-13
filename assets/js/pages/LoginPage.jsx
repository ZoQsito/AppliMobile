import React, {useState, useContext} from 'react';
import Field from '../components/Field';


const LoginPage = ({history}) => {

    const { setIsAuthenticated } = useState(true)

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })


    const [error, setError] = useState("");



    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setCredentials({...credentials, [name]: value});
    }

    const handleSubmit = async (event) => {
    }

    return ( <>
    

    <h1>Connexion à l'application</h1>&nbsp;

    <form onSubmit={handleSubmit}>
        <Field label="Adresse email" name="username" value={credentials.username} onChange={handleChange} placeholder="Adresse email de connexion" error={error} />
        &nbsp;
        <Field label="Mot de Passe" name="password" value={credentials.password} onChange={handleChange} error={error} type="password" />
        &nbsp;
        <div className="form-group">
            <button type='submit' className="btn btn-primary">Connexion</button>
        </div>
    </form>
    
    </> 
    
    );
}
 
export default LoginPage;