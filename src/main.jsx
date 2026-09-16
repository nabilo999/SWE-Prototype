import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Home, BookOpen, CheckSquare, CalendarDays, Settings, ChevronRight, ArrowRight, Clock3, MapPin, X, Menu, GraduationCap } from 'lucide-react';
import './styles.css';

const courses = [
  { code: 'CS 220', name: 'Data Structures', badge: 'CS', color: 'blue', instructor: 'Prof. Maya Chen', meeting: 'Mon & Wed · 9:00 AM' },
  { code: 'CS 320', name: 'Web Development', badge: 'CS', color: 'blue', instructor: 'Prof. David Park', meeting: 'Mon & Wed · 11:00 AM' },
  { code: 'MATH 121', name: 'Linear Algebra', badge: 'MATH', color: 'indigo', instructor: 'Prof. Elena Ruiz', meeting: 'Tue & Thu · 10:00 AM' },
  { code: 'CS 450', name: 'Database Systems', badge: 'CS', color: 'blue', instructor: 'Prof. Andrew Wilson', meeting: 'Tue & Thu · 2:00 PM' },
  { code: 'ENG 101', name: 'College Writing', badge: 'ENG', color: 'sky', instructor: 'Prof. Alana Brooks', meeting: 'Fri · 10:30 AM' }
];
const assignments = [
  { course: 'CS 220', title: 'Homework 3 – Trees & Backtracking', due: 'Due Sep 16, 2026 · 11:59 PM' },
  { course: 'CS 320', title: 'Project 2 – Web App Prototype', due: 'Due Sep 18, 2026 · 11:59 PM' },
  { course: 'MATH 121', title: 'Homework 4 – Linear Algebra', due: 'Due Sep 19, 2026 · 11:59 PM' },
  { course: 'CS 450', title: 'Reading Response – Week 4', due: 'Due Sep 20, 2026 · 11:59 PM' }
];
const events = [
  { date: 'SEP', day: '16', weekday: 'Tue', title: 'Career Fair Prep Workshop', detail: '12:00 PM – 1:00 PM · Hunter College' },
  { date: 'SEP', day: '17', weekday: 'Wed', title: 'CUNY Tech Prep Info Session', detail: '11:00 AM – 12:00 PM · Hunter East 451' },
  { date: 'SEP', day: '18', weekday: 'Thu', title: 'Student Organization Fair', detail: '10:00 AM – 3:00 PM · Hunter College' },
  { date: 'SEP', day: '20', weekday: 'Sat', title: 'Brooklyn Campus Tour', detail: '9:00 AM – 12:00 PM · Meet at Library' }
];
const schedule = [
  { time: '9:00 AM – 10:20 AM', title: 'CS 220 – Data Structures', detail: 'Hunter College · Room 721', tone: 'blue' },
  { time: '11:00 AM – 12:20 PM', title: 'CS 320 – Web Development', detail: 'Hunter College · Room 602', tone: 'blue' },
  { time: '2:00 PM – 3:20 PM', title: 'Study Hall', detail: 'Hunter College · Library', tone: 'purple' },
  { time: '5:00 PM – 6:30 PM', title: 'Campus Event: Tech Talk', detail: 'Hunter College · 68th St. Lobby', tone: 'green' }
];

function App() {
  const [active, setActive] = useState('Home');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return { courses: courses.filter(x => `${x.code} ${x.name}`.toLowerCase().includes(needle)), assignments: assignments.filter(x => `${x.course} ${x.title}`.toLowerCase().includes(needle)), events: events.filter(x => `${x.title} ${x.detail}`.toLowerCase().includes(needle)) };
  }, [query]);
  const nav = [{label:'Home', icon:Home}, {label:'Courses', icon:BookOpen}, {label:'Assignments', icon:CheckSquare}, {label:'Events', icon:CalendarDays}];
  const title = active === 'Home' ? 'Good afternoon, John 👋' : active;
  const subtitle = active === 'Home' ? "Here’s your week at a glance. Stay on track!" : `Your ${active.toLowerCase()}—organized in one place.`;
  return <div className="app-shell">
    <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><span className="cuny">CU<br/>NY</span><span className="divider"/><b>Student Hub</b></div>
      <nav>{nav.map(({label,icon:Icon}) => <button key={label} onClick={() => {setActive(label);setMenuOpen(false)}} className={active===label?'active':''}><Icon size={22}/><span>{label}</span></button>)}</nav>
      <div className="profile"><div className="avatar">JD</div><div><strong>John Doe</strong><small>Hunter College</small></div><button className="settings" aria-label="Settings"><Settings size={19}/></button></div>
    </aside>
    <main>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><Menu size={22}/></button>
      <section className="hero"><div><h1>{title}</h1><p>{subtitle}</p></div><label className="search"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search courses, assignments, events..."/></label></section>
      {query && <div className="search-note">Showing results for “{query}”</div>}
      {active === 'Home' ? <Dashboard data={filtered} open={setModal} setActive={setActive}/> : <SectionPage section={active} data={filtered} open={setModal}/>} 
    </main>
    {modal && <DetailModal item={modal} close={() => setModal(null)}/>} 
  </div>
}

function Dashboard({data, open, setActive}) { return <>
  <div className="top-grid"><Panel title="Today's Schedule" action="View Full Calendar" onAction={()=>open({title:'Your full schedule', kind:'Schedule', items:schedule})} className="schedule-panel"><div className="date">Mon, Sep 15, 2026</div>{schedule.map(item=><ScheduleRow key={item.title} item={item} onClick={()=>open(item)}/>)}</Panel><Panel title="Upcoming Assignments" action="View All" onAction={()=>setActive('Assignments')}><List items={data.assignments} type="assignment" open={open}/></Panel></div>
  <div className="bottom-grid"><Panel title="My Courses" action="View All" onAction={()=>setActive('Courses')}><List items={data.courses} type="course" open={open}/></Panel><Panel title="Campus Events" action="View All" onAction={()=>setActive('Events')}><List items={data.events} type="event" open={open}/></Panel></div>
</> }
function SectionPage({section,data,open}) { const type = section === 'Courses' ? 'course' : section === 'Assignments' ? 'assignment' : 'event'; const items = section === 'Courses' ? data.courses : section === 'Assignments' ? data.assignments : data.events; return <Panel title={`All ${section}`} className="full-panel"><List items={items} type={type} open={open}/></Panel> }
function Panel({title,action,onAction,children,className=''}) {return <section className={`panel ${className}`}><div className="panel-head"><h2>{title}</h2>{action&&<button className="link-btn" onClick={onAction}>{action}<ArrowRight size={16}/></button>}</div>{children}</section>}
function ScheduleRow({item,onClick}) {return <button className="schedule-row" onClick={onClick}><span className={`dot ${item.tone}`}/><span className="time">{item.time}</span><span className="session"><b>{item.title}</b><small>{item.detail}</small></span></button>}
function List({items,type,open}) { if (!items.length) return <div className="empty">No matching items found.</div>; return <div className="list">{items.map((item,i)=><button className="list-row" key={item.title||item.name} onClick={()=>open(item)}>{type==='course'&&<span className={`course-badge ${item.color}`}>{item.badge}</span>}{type==='assignment'&&<span className="tag">{item.course}</span>}{type==='event'&&<span className="event-date"><b>{item.date}</b><strong>{item.day}</strong><small>{item.weekday}</small></span>}<span className="list-copy"><b>{item.title||item.code}</b><small>{item.name||item.due||item.detail}</small></span>{type==='course'&&<span className="view">View Brightspace</span>}<ChevronRight size={18}/></button>)}</div>}
function DetailModal({item,close}) {const detail=item.detail||item.due||item.meeting||'A focused space for the things that matter most this week.';return <div className="modal-backdrop" onMouseDown={close}><section className="modal" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={close}><X/></button><span className="modal-icon"><CalendarDays/></span><h2>{item.title||item.code}</h2><p>{item.name || detail}</p><div className="detail-line"><Clock3 size={18}/>{item.due||item.meeting||detail}</div><div className="detail-line"><MapPin size={18}/>Hunter College</div><button className="primary" onClick={close}>Got it</button></section></div>}

createRoot(document.getElementById('root')).render(<App/>);
