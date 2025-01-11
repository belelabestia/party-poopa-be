select e.*, jsonb_agg(p) filter (where p.id is not null) as people
from events e
left join invitations i on i.event_id = e.id
left join people p on p.id = i.person_id
group by e.id;
