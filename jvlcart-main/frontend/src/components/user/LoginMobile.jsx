import { useState } from "react";
import OtpInput from "./otp-input";

const LoginMobile = () => {
    const [phonenumber, setphonenumber] = useState("");
    const [showOtpInput, setshowOtpInput] = useState(false);

    const handlephonenumber = (event) => {
        setphonenumber(event.target.value)
    }


    const handlePhoneSubmit = (event) => {
        event.preventDefault();

        //phone validation
        const regex = /[^0-9]/g;
        if (phonenumber.length < 10 || regex.test(phonenumber)) {
            alert("invalid phone number");
            return;
        }

        //call BE API
        //show OTP Field
        setshowOtpInput(true);
    }

    const onOtpSubmit = (otp) => {
        console.log("login successful",otp)
    }

    return <div>
        <h1>Login with Phone</h1>

        {!showOtpInput? < form onSubmit={handlePhoneSubmit}>
            <input type="text" value={phonenumber} onChange={handlephonenumber} placeholder="Enter Phone Number" />
            <button type="submit">Submit</button>
    </form> : <div>
        <p>Enter OTP sent to {phonenumber}</p>
        <OtpInput length={4} onOtpSubmit={onOtpSubmit}/>
    </div>
}
    </div >
}

export default LoginMobile;