namespace insurance;

entity User {
    key userId            : String;
        email             : String;
        phone             : String;
        username          : String;
        password          : String;
        role              : String;
        failedAttempts    : Integer;
        lastFailedAttempt : DateTime;
        isLocked          : String;
        lockUntil         : DateTime;
        otp               : String;
        otpGeneratedAt    : DateTime;

}


entity Policies {
    key policyId           : String;
        policyName         : String;
        policyType         : String;
        applicableAge      : String;
        policyDescription  : String;
        claimAmount        : Decimal;
        Interest           : Decimal;
        termLength         : Integer;
        startDate          : Date;
        termsAndConditions : String;
}


entity Applications {
    key applicationId       : String;
        user                : Association to one User;
        policy              : Association to one Policies;
        applicantName       : String;
        applicantAge        : String;
        applicantAddress    : String;
        applicantMobileNo   : String;
        applicantEmail      : String;
        applicantAadhar     : String;
        applicantPan        : String;
        applicationDate     : Date;
        status              : String;
        documentFileName    : String;
        @Core.MediaType  : documentMimeType
        documentContent     : LargeBinary;
        @Core.IsMediaType: true
        documentMimeType    : String;
}

entity Documents {
    key documentId     : String;
        documentType   : String;
        documentUpload : LargeBinary;
        application    : Association to one Applications;
}
