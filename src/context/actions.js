//import { Auth } from "aws-amplify";

export async function loginUser(dispatch, loginPayload) {
  try {
    dispatch({ type: "REQUEST_LOGIN" });
    // let response = await Auth.signIn(loginPayload);
    // let data = await response.json();
    // console.log(data);

    /* if (data.user) {
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      localStorage.setItem("currentUser", JSON.stringify(data));
      return data;
    } */

    //dispatch({ type: "LOGIN_ERROR", error: error });
    return;
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", error: error });
  }
}

export async function logout(dispatch) {
  dispatch({ type: "LOGOUT" });
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
}
