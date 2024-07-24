import { useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearAuthError } from '../../actions/userActions';
import {useNavigate, useParams} from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch();
    const { isAuthenticated, error }  = useSelector(state => state.authState)
    const navigate = useNavigate();
    const { token } = useParams();

    const submitHandler  = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        
        dispatch(resetPassword(formData, token))
    }

    useEffect(()=> {
        if(isAuthenticated) {
            toast('Password Reset Success!', {
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER
            })
            navigate('/')
            return;
        }
        if(error)  {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearAuthError) }
            })
            return
        }
    },[isAuthenticated, error, dispatch, navigate])

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5"  style={{ textAlign: 'center', marginBottom: '20px' }}>
                <form onSubmit={submitHandler} className="shadow-lg">
                <img 
                            src="https://cdn-icons-png.flaticon.com/512/6357/6357048.png" // Replace with the path to your image or GIF
                            alt="Visual Aid" 
                            style={{ width: '100px', height: 'auto' }} // Adjust width as needed
                        />
                    <h1 className="mb-3"> New Password</h1>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your new password."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_password_field">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="form-control"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="confirm new password"
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        id="new_password_button"
                        type="submit"
                        style={{ backgroundColor: '#102C57',
                             color: '#fff',
                             borderRadius:'20px',
                              
                          
                            padding: '10px 20px', 
                            fontSize: '14px', 
                            width: '150px',
                            transition: 'background-color 0.3s, transform 0.3s, box-shadow 0.3s',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            borderWidth:'0px'
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
                        }}>
                        Set Password
                    </button>
                    </div>
                </form>
            </div>
        </div>
    )
}