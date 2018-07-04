import React from "react"
import TextField from "Components/TextField"
import Button from "Components/Button"
import { connect } from "react-redux"
import { forgotPassword } from "Actions"

const ForgotPassword = ({ forgotPassword, handleChange, submit }) => (
  <section className="ldc-forgot-password">
    <h1>Forgot your password?</h1>
    <p>
      Enter the email address associated with your account, and we’ll email you
      a link to reset your password.
    </p>
    <TextField
      placeholder="Email"
      name="email"
      type="email"
      value={forgotPassword.email}
      onChange={e => handleChange("email", e.target.value)}
    />
    <Button
      label="Send Reset Link"
      onClick={submit}
      disabled={!forgotPassword.email}
    />
  </section>
)

const mapStateToProps = state => ({
  forgotPassword: state.forgotPassword,
})

export default connect(mapStateToProps, {
  handleChange: forgotPassword.forgotPassswordHandleChange,
  submit: forgotPassword.forgotPassswordUserSubmit,
})(ForgotPassword)