namespace insurance;

entity User {
    key userId: Integer;
    email: String;
    mobilenumber: String;
    username: String;
    password: String;
    role: String; //admin or customer
}

entity Policies {
    key policyId: Integer;
    policyName: String;
    policyType: String;
    policyDescription: String;
    premiumAmount: Decimal;
    coverageAmount: Decimal;
    termLength: Integer;  // means years
    startDate: Date;
}

entity Applications {
    key applicationId: Integer;
    user: Association to one User;
    policy: Association to one Policies;
    applicantName: String;
    applicantAge: String;
    applicantAddress: String;
    applicantMobile: String;
    applicantEmail: String;
    applicationAadhar: String;
    applicationPan: String;
    applicantOccupation: String;
    applicationDate: Date;
    status: String;
    documentType: String;
}

entity Documents {
    key documentId: Integer;
    documentType: String;
    documentUpload: LargeBinary;
    user: Association to one User;
}

entity premiumSchedule {
    key premiumId: Integer;
    user: Association to one User;
    policy: Association to one Policies;
    application: Association to one Applications;
    installmentNumber: Integer;  //1,2,3 installments based on termlength
    amount:Decimal(10,2); // calculated amount per installment
    dueDate: Date;     // due date for the installment
    status: String;  //pending or paid
}
