SELECT Company.company_id, Company.company_name
FROM AppearsIn
JOIN Company ON AppearsIn.company_id = Company.company_id;