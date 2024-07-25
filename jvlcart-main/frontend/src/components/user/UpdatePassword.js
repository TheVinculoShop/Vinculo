import { useEffect, useState } from 'react';
import { updatePassword as updatePasswordAction, clearAuthError } from '../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function UpdatePassword() {
    
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const dispatch = useDispatch();
    const { isUpdated, error } = useSelector(state => state.authState)

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('oldPassword', oldPassword);
        formData.append('password', password);
        dispatch(updatePasswordAction(formData))
    }

    useEffect(() => {
        if(isUpdated) {
            toast('Password updated successfully',{
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER
            })
            setOldPassword("");
            setPassword("")
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
    },[isUpdated, error, dispatch])

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <form onSubmit={submitHandler} className="shadow-lg">
                 
                <img 
                            src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png" // Replace with the path to your image or GIF
                            alt="Visual Aid" 
                            style={{ width: '100px', height: 'auto' }} // Adjust width as needed
                        />
                    <h1 className="mt-2 mb-5">Update Password</h1>
                    <div className="form-group">
                        <label htmlFor="old_password_field">Old Password</label>
                        <input
                            type="password"
                            id="old_password_field"
                            className="form-control"
                            value={oldPassword}
                            onChange={e=>setOldPassword(e.target.value)}
                            placeholder="Please enter your old password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="new_password_field">New Password</label>
                        <input
                            type="password"
                            id="new_password_field"
                            className="form-control"
                            value={password}
                            onChange={e=>setPassword(e.target.value)}
                            placeholder="Please enter your new password"
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button 
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
                                borderWidth:'0px'
                            }}
                            className="btn update-btn mt-4 mb-3"
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
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
