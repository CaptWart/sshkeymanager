const passport = require('passport');
const LdapStrategy = require('passport-ldapauth')
const base = process.env.base;
const ldapUrl = process.env.ldapUrl;

const OPTS = {
    server: {
      url: ldapUrl,
      searchBase: base,
      searchFilter: '(uid={{username}})'
    }
  };

passport.use(new LdapStrategy(OPTS));

