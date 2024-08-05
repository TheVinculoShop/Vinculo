import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../actions/userActions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [userData, setUserData] = useState({
        fullName: "",
        emailAddress: "",
        userPassword: ""
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.authState);

    const onChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', userData.fullName);
        formData.append('email', userData.emailAddress);
        formData.append('password', userData.userPassword);
        dispatch(register(formData));
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
            return;
        }
        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => { dispatch(clearAuthError()) }
            });
            return;
        }
    }, [error, isAuthenticated, dispatch, navigate]);

    return (
        <div className="wrapper" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: '#f8f9fa', 
            fontFamily: 'Arial, sans-serif', 
            margin: 0,
            padding: '0 20px' 
        }}>
            <img src="/images/reg.AVIF" alt="Side" style={{ 
                position: 'absolute', 
                left: '0', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '300px', 
                height: '200px',
                display: 'none', 
                '@media (min-width: 768px)': { 
                    display: 'block'
                }
            }} />
            <div style={{ 
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
                borderRadius: '0.75rem', 
                backgroundColor: '#ffffff', 
                padding: '20px', 
                width: '100%', 
                maxWidth: '400px', 
                position: 'relative',
                marginTop: '0', 
                '@media (max-width: 767px)': { 
                    padding: '15px',
                    maxWidth: '100%'
                }
            }}>
                <form onSubmit={submitHandler} className="shadow-lg p-4 rounded" encType='multipart/form-data' style={{ 
                    backgroundColor: '#ffffff', 
                    color: '#102C57', 
                    fontFamily: 'Arial, sans-serif', 
                    borderRadius: '0.75rem', 
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
                }}>
                    <div className="d-flex align-items-center justify-content-center mb-4" style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '@media (max-width: 767px)': { 
                            flexDirection: 'column'
                        }
                    }}>
                        <h1 className="mb-0" style={{ 
                            color: '#102C57', 
                            fontSize: '1.75rem', 
                            marginRight: '0', 
                            marginBottom: '10px',
                            '@media (min-width: 768px)': { 
                                fontSize: '2.25rem',
                                marginRight: '20px',
                                marginBottom: '0'
                            }
                        }}>Sign Up</h1>
                        <img src="/images/logopic.png" alt="Logo" style={{ 
                            width: '30px',
                            marginLeft: '10px',
                            '@media (max-width: 767px)': { 
                                width: '25px',
                                marginLeft: '0',
                                marginTop: '10px'
                            }
                        }} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName_field" className="font-weight-bold" style={{ color: '#102C57' }}>Full Name</label>
                        <input
                            name='fullName'
                            onChange={onChange}
                            type="text"
                            id="fullName_field"
                            className="form-control"
                            placeholder="Enter your full name"
                            style={{ 
                                borderColor: '#102C57', 
                                borderRadius: '0.5rem', 
                                fontFamily: 'Arial, sans-serif', 
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                                transition: 'border-color 0.3s' 
                            }}
                            required
                            onFocus={e => e.target.style.borderColor = '#CFD8DC'}
                            onBlur={e => e.target.style.borderColor = '#102C57'}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="emailAddress_field" className="font-weight-bold" style={{ color: '#102C57' }}>Email Address</label>
                        <input
                            type="email"
                            id="emailAddress_field"
                            name='emailAddress'
                            onChange={onChange}
                            className="form-control"
                            placeholder="Enter your email address"
                            style={{ 
                                borderColor: '#102C57', 
                                borderRadius: '0.5rem', 
                                fontFamily: 'Arial, sans-serif', 
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                                transition: 'border-color 0.3s' 
                            }}
                            required
                            onFocus={e => e.target.style.borderColor = '#CFD8DC'}
                            onBlur={e => e.target.style.borderColor = '#102C57'}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="userPassword_field" className="font-weight-bold" style={{ color: '#102C57' }}>Password</label>
                        <input
                            name='userPassword'
                            onChange={onChange}
                            type="password"
                            id="userPassword_field"
                            className="form-control"
                            placeholder="Create a password"
                            style={{ 
                                borderColor: '#102C57', 
                                borderRadius: '0.5rem', 
                                fontFamily: 'Arial, sans-serif', 
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                                transition: 'border-color 0.3s' 
                            }}
                            required
                            minLength="6"
                            onFocus={e => e.target.style.borderColor = '#CFD8DC'}
                            onBlur={e => e.target.style.borderColor = '#102C57'}
                        />
                    </div>

                    <button
                        id="register_button"
                        type="submit"
                        className="btn btn-primary btn-block py-2"
                        disabled={loading}
                        style={{
                            backgroundColor: '#102C57',
                            borderColor: '#102C57',
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '0.875rem',
                            borderRadius: '1.5rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            color: '#ffffff',
                            transition: 'background-color 0.3s ease',
                            width: '100%',
                            margin: '10px 0'
                        }}
                        onMouseEnter={e => e.target.style.backgroundColor = '#CFD8DC'}
                        onMouseLeave={e => e.target.style.backgroundColor = '#102C57'}
                    >
                        {loading ? 'REGISTERING...' : 'SIGN UP'}
                    </button>
                </form>
            </div>
        </div>
    );
}
