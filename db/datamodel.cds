namespace insurance;

entity User {
    key userId: String;
    email: String;
    phone: String;
    username: String;
    password: String;
    role: String;
}

entity Policies {
    key policyId: String;
    policyName: String;
    policyType: String;
    policyDescrption: String;
    premiumAmount: Decimal;
    coverageAmount: Decimal;
    termLength: Integer;
    startDate: Date;
}

entity Applications {
    key applicationId: String;
    user: Association to one User;
    policy: Association to one Policies;
    applicantName: String;
    applicantAge: String;
    applicantAddress: String;
    applicantMobile: Int64;
    applicantEmail: String;
    applicantOccupation: String;
    applicationDate: Date;
    status: String;
    documentType: String;
}
