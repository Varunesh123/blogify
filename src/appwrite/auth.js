import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      if (userAccount) {
        return this.login({ email, password });
      }
      return userAccount;
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const session = await this.account.getSession('current');
      if (session) {
        return await this.account.get();
      } else {
        console.log("No active session. User needs to log in.");
        return null;  // No session, user needs to log in
      }
    } catch (error) {
      console.error("Appwrite service :: getCurrentUser :: error", error);
      if (error.message.includes("missing scope")) {
        console.log("Guest user, login required.");
        return null;  // Handle guest users properly
      }
      throw error;  // Re-throw other types of errors
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
