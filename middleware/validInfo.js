module.exports = function(req, res, next) {
    const { login, password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    function validPhone(userEmail){
        return /^(\+375|80|375)(29|25|44|33)(\d{3})(\d{2})(\d{2})$/.test(userEmail)
    }
  
    if (req.path === "/signup") {
      console.log(!login.length);
      if (![login, password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (validPhone(login) && validEmail(login)) {
        return res.json(validPhone(login) +""+ !validEmail(login));
      }
      else if (!validPhone(login) && !validEmail(login)) {
        return res.status(402).json("Invalid id");
      }
    } else if (req.path === "/signin") {
      if (![login, password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (validPhone(login) && validEmail(login)) {
        return res.json(validPhone(login) +""+ !validEmail(login));
      }
      else if (!validPhone(login) && !validEmail(login)) {
        return res.json("Invalid id");
      }
    }
  
    next();
  };