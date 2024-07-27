import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { forgotPassword, clearAuthError } from "../../actions/userActions";


export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const { error, message } = useSelector(state => state.authState);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        dispatch(forgotPassword(formData))
    }

    useEffect(() => {
        if (message) {
            toast(message, {
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER
            })
            setEmail("");
            return;
        }

        if (error) {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: () => { dispatch(clearAuthError) }
            })
            return
        }
    }, [message, error, dispatch])


    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img 
                            src="https://www.freeiconspng.com/thumbs/forgot-password-icon/forgot-password-icon-14.png" // Replace with the path to your image or GIF
                            alt="Visual Aid" 
                            style={{ width: '100px', height: 'auto' }} // Adjust width as needed
                        />
                    </div>
                    <h1 className="mb-3">Forgot Password?</h1>
                    <div className="form-group">
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Please enter the email used to sign in."
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            id="forgot_password_button"
                            type="submit"
                            style={{
                                backgroundColor: '#102C57',
                                color: '#fff',
                                borderRadius: '20px',
                                padding: '10px 20px',
                                fontSize: '14px',
                                width: '150px',
                                transition: 'background-color 0.3s, transform 0.3s, box-shadow 0.3s',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                borderWidth: '0px'
                            }}
                            className="btn btn-block py-3"
                            onMouseOver={e => {
                                e.target.style.backgroundColor = '#0A1C3B';
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
                            }}
                            onMouseOut={e => {
                                e.target.style.backgroundColor = '#102C57';
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                            }}
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
