SELECT 
    u.username, 
    p.title AS problem_title, 
    s.solve_date, 
    s.attempts, 
    s.status
FROM Solves s
JOIN User u ON s.user_id = u.user_id
JOIN Problem p ON s.problem_id = p.problem_id
ORDER BY s.solve_date DESC;