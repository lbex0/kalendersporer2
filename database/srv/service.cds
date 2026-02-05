
using { kalendersporer as db } from '../db/schema.cds';

service KalenderService {
  entity Ansatt as projection on db.Ansatt;
  entity Reiseplan as projection on db.Reiseplan;
  entity Fraværssøknad as projection on db.Fraværssøknad;
  entity Fridager as projection on db.Fridager;
  entity LoginInfo as projection on db.LoginInfo;

  action validateLogin(username: String, password: String) returns {
    accessToken: String;
    refreshToken: String;
  } @(requires: 'any');

  action refreshToken(refreshToken: String) returns {
    accessToken: String;
  } @(requires: 'any');
}
