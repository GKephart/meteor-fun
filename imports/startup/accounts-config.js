//needed packaging for for user singin through meteors built in client
import { Accounts } from 'meteor/accounts-base';


/**
* method needed to change login built by meteor from email to username.
*/

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});
