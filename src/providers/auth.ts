// @ts-ignore
import { AuthProvider } from "@refinedev/core";
import { API_URL, dataProvider } from "./data";

export const authCredentials = {
  email: "michael.scott@dundermifflin.com",
  password: "demodemo",
};

export const authProvider: AuthProvider = {
  login: async ({ email }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          // przekazanie wiadomości e-mail, aby sprawdzić, czy użytkownik istnieje jeśli tak to zwróć token dostępu
          rawQuery: `
            mutation Login($email: String!) {
              login(loginInput: { email: $email }) {
                accessToken
              }
            }
          `,
        },
      });

      // zapisanie accessToken z localStorage
      localStorage.setItem("access_token", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },

  // usuwanie accessToken z localStorage przy wylogowaniu
  logout: async () => {
    localStorage.removeItem("access_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  onError: async (error) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
        ...error,
      };
    }

    return { error };
  },

  check: async () => {
    try {
      //  uwierzytelnianie uzytkownika i sprawdzenie autentykacji
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: `
            query Me {
              me {
                name
              }
            }
          `,
        },
      });

      // jesli autoryzacja przejdzie przenosi nas do /home
      return {
        authenticated: true,
        redirectTo: "/",
      };
    } catch (error) {
      // przy błedzie redirectuje do strony login
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  // otrzymanie informacji o użytkowniku
  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      // wywołanie interfejsu API GraphQL, aby uzyskać informacje o użytkowniku
      const { data } = await dataProvider.custom<{ me: any }>({
        url: API_URL,
        method: "post",
        headers: accessToken
          ? {
              // wysyłanie accessToken do autoryzacji
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
        meta: {
          // do uzyskania informacji o użytkowniku, takich jak imię i nazwisko, adres e-mail itp.
          rawQuery: `
            query Me {
              me {
                id
                name
                email
                phone
                jobTitle
                timezone
                avatarUrl
              }
            }
          `,
        },
      });

      return data.me;
    } catch (error) {
      return undefined;
    }
  },
};