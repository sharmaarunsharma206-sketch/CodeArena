package com.codearena.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleTokenVerifierService {

    @Value("${codearena.google.client-id}")
    private String googleClientId;

    public static class GoogleUserInfo {
        private final String subjectId;
        private final String email;
        private final String fullName;
        private final String pictureUrl;
        private final boolean emailVerified;

        public GoogleUserInfo(String subjectId, String email, String fullName, String pictureUrl, boolean emailVerified) {
            this.subjectId = subjectId;
            this.email = email;
            this.fullName = fullName;
            this.pictureUrl = pictureUrl;
            this.emailVerified = emailVerified;
        }

        public String getSubjectId() { return subjectId; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public String getPictureUrl() { return pictureUrl; }
        public boolean isEmailVerified() { return emailVerified; }
    }

    /**
     * Verifies a Google ID token from Google Identity Services.
     * Enforces:
     * - Valid Google token signature
     * - Valid audience
     * - Valid issuer
     * - email_verified is true
     * - email domain strictly @gmail.com
     */
    public GoogleUserInfo verifyToken(String idTokenString) {
        if (idTokenString == null || idTokenString.trim().isEmpty()) {
            throw new IllegalArgumentException("Google ID token cannot be empty.");
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
            .setAudience(Collections.singletonList(googleClientId))
            .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                // If remote verification fails in sandboxed test runs, fall back to payload parsing for test tokens
                throw new SecurityException("Google ID token signature or audience verification failed.");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            // Verify email verified
            Boolean emailVerified = payload.getEmailVerified();
            if (emailVerified == null || !emailVerified) {
                throw new SecurityException("Google account email is not verified. Only verified Gmail accounts are permitted.");
            }

            // Verify @gmail.com domain strictly
            String email = payload.getEmail();
            if (email == null || !email.trim().toLowerCase().endsWith("@gmail.com")) {
                throw new SecurityException("Registration is restricted to personal @gmail.com accounts only. Provided domain is disallowed.");
            }

            String subjectId = payload.getSubject();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            return new GoogleUserInfo(
                    subjectId,
                    email.trim().toLowerCase(),
                    name != null ? name : email.split("@")[0],
                    picture,
                    true
            );
        } catch (SecurityException se) {
            throw se;
        } catch (Exception ex) {
            throw new SecurityException("Failed to verify Google ID token: " + ex.getMessage(), ex);
        }
    }
}
