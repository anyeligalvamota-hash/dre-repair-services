from datetime import datetime, timezone
from pathlib import Path
import uuid

rows = '''P4032101|2026-09-10|16:00-20:30|Marco conceptual de la gestión de Proyectos|Aula 14
P4032101|2026-09-11|16:00-20:30|Marco conceptual de la gestión de Proyectos|Aula 14
P4032101|2026-09-17|16:00-20:30|Marco conceptual de la gestión de Proyectos|Aula 14
P4032101|2026-09-18|16:00-20:30|Marco conceptual de la gestión de Proyectos|Aula 14
P4032101|2026-09-24|16:00-18:00|Marco conceptual de la gestión de Proyectos|Aula 14
P4032102|2026-09-24|18:30-20:30|Gestión del alcance del proyecto|Aula 14
P4032102|2026-09-25|16:00-20:30|Gestión del alcance del proyecto|Aula 14
P4032101|2026-10-01|16:00-18:00|Marco conceptual de la gestión de Proy. (examen)|Aula 14
P4032102|2026-10-01|18:30-20:30|Gestión del alcance del proyecto|Aula 14
P4032102|2026-10-02|16:00-20:30|Gestión del alcance del proyecto|A. Inf.
P4032102|2026-10-08|16:00-20:30|Gestión del alcance del proyecto|Aula 14
P4032103|2026-10-09|16:00-20:30|Gestión del tiempo y recursos|Aula 14
P4032102|2026-10-15|16:00-18:00|Gestión del alcance del proyecto (examen)|Aula 14
P4032103|2026-10-15|18:30-20:30|Gestión del tiempo y recursos|Aula 14
P4032103|2026-10-16|16:00-20:30|Gestión del tiempo y recursos|Aula 14
P4032103|2026-10-22|16:00-20:30|Gestión del tiempo y recursos|A. Inf.
P4032103|2026-10-23|16:00-18:00|Gestión del tiempo y recursos|A. Inf.
P4032104|2026-10-23|18:30-20:30|Seguimiento y control del proyecto|Aula 14
P4032103|2026-10-29|16:00-18:00|Gestión del tiempo y recursos (examen)|Aula 14
P4032104|2026-10-29|18:30-20:30|Seguimiento y control del proyecto|Aula 14
P4032104|2026-10-30|16:00-20:30|Seguimiento y control del proyecto|A. Inf.
P4032104|2026-11-05|16:00-20:30|Seguimiento y control del proyecto|Aula 14
P4032104|2026-11-06|16:00-20:30|Seguimiento y control del proyecto|A. Inf.
P4032104|2026-11-12|16:00-18:00|Seguimiento y control del proyecto (examen)|A. Inf.
P4032105|2026-11-12|18:30-20:30|Gestión de la información y comunicaciones del p.|A. Inf.
P4032105|2026-11-13|16:00-18:30|Gestión de la información y comunicaciones del p.|A. Inf.
P4032105|2026-11-13|18:30-20:30|Gestión de la información y comunicaciones del p|A. Inf.
P4032105|2026-11-19|16:00-18:00|Gestión de la información y comunicaciones del p|A. Inf.
P4032105|2026-11-19|18:30-20:30|Gestión de la información y comunicaciones del p|A. Inf.
P4032105|2026-11-20|16:00-20:30|Gestión de la información y comunicaciones del p.|A. Inf.
P4032105|2026-11-26|16:00-20:30|Gestión de la información y comunicaciones del p..|A. Inf.
P4032106|2026-11-27|16:00-20:30|Dirección de personas|Aula 14
P4032105|2026-12-03|16:00-18:00|Gestión de la información y las comunic. (examen)|Aula 14
P4032106|2026-12-03|18:30-20:30|Dirección de personas|Aula 14
P4032106|2026-12-04|16:00-20:30|Dirección de personas|Aula 14
P4032106|2026-12-10|16:00-20:30|Dirección de personas|Aula 14
P4032106|2026-12-11|16:00-18:00|Dirección de personas|Aula 14
P4032109|2026-12-11|18:30-20:30|Contratación y negociación|Aula 14
P4032106|2026-12-17|16:00-18:00|Dirección de personas (examen)|Aula 14
P4032109|2026-12-17|18:30-20:30|Contratación y negociación|Aula 14
P4032109|2026-12-18|16:00-20:30|Contratación y negociación|Aula 14
P4032109|2027-01-07|16:00-20:30|Contratación y negociación|Aula 14
P4032109|2027-01-08|16:00-20:30|Contratación y negociación|Aula 14
P4032109|2027-01-14|16:00-18:00|Contratación y negociación|Aula 14
P4032110|2027-01-14|18:30-20:30|Gestión de Riesgos y Oportunidades del Proyecto|Aula 14
P4032110|2027-01-15|16:00-20:30|Gestión de Riesgos y Oportunidades del Proyecto|Aula 14
P4032109|2027-01-21|16:00-18:00|Contratación y negociación (examen)|Aula 14
P4032110|2027-01-21|18:30-20:30|Gestión de Riesgos y Oportunidades del Proyecto|Aula 14
P4032110|2027-01-22|16:00-20:30|Gestión de Riesgos y Oportunidades del Proyecto|Aula 14
P4032110|2027-01-28|16:00-20:30|Gestión de Riesgos y Oportunidades del Proyecto|Aula 14
P4032110|2027-02-04|16:00-18:00|Gestión de Riesgos y Oportunidades del p. (examen)|Aula 14
P4032107|2027-02-04|18:30-20:30|Gestión de la calidad|Aula 14
P4032107|2027-02-05|16:00-20:30|Gestión de la calidad|Aula 14
P4032107|2027-02-11|16:00-18:00|Gestión de la calidad|Aula 14
P4032107|2027-02-12|18:30-20:30|Gestión de la calidad|Aula 14
P4032107|2027-02-18|16:00-18:00|Gestión de la calidad|Aula 14
P4032108|2027-02-18|18:30-20:30|Análisis de la viabilidad financiera|Aula 14
P4032108|2027-02-19|16:00-20:30|Análisis de la viabilidad financiera|Aula 14
P4032107|2027-02-25|16:00-18:00|Gestión de la calidad|Aula 14
P4032108|2027-02-25|18:30-20:30|Análisis de la viabilidad financiera|Aula 14
P4032108|2027-02-26|16:00-20:30|Análisis de la viabilidad financiera|Aula 14
P4032108|2027-03-04|16:00-20:30|Análisis de la viabilidad financiera|Aula 14
P4032108|2027-03-05|16:00-18:00|Análisis de la viabilidad financiera|Aula 14
P4032202|2027-03-05|18:30-20:30|Gestión de riesgos en proyectos de inversión|Aula 14
P4032108|2027-03-11|16:00-18:00|Análisis de la viabilidad financiera (examen)|Aula 14
P4032202|2027-03-11|18:30-20:30|Gestión de riesgos en proyectos de inversión|Aula 14
P4032202|2027-03-12|16:00-20:30|Gestión de riesgos en proyectos de inversión|Aula 14
P4032202|2027-03-18|16:00-20:30|Gestión de riesgos en proyectos de inversión|Aula 14
P4032202|2027-04-01|16:00-20:30|Gestión de riesgos en proyectos de inversión|Aula 14
P4032204|2027-04-02|16:00-20:30|Sostenibilidad en dirección de proyectos|Aula 14
P4032202|2027-04-08|16:00-18:00|Gestión de riesgos en p de inversión (examen)|Aula 14
P4032204|2027-04-08|18:30-20:30|Sostenibilidad en dirección de proyectos|Aula 14
P4032204|2027-04-09|16:00-20:30|Sostenibilidad en dirección de proyectos|Aula 14
P4032204|2027-04-15|16:00-20:30|Sostenibilidad en dirección de proyectos|Aula 14
P4032204|2027-04-16|16:00-18:00|Sostenibilidad en dirección de proyectos|Aula 14
P4032204|2027-04-22|16:00-18:00|Sostenibilidad en dirección de proy. (examen)|Aula 14'''.splitlines()

def esc(s):
    return str(s).replace('\\','\\\\').replace(';','\\;').replace(',','\\,').replace('\n','\\n')

def utc_stamp(date_s, time_s):
    from zoneinfo import ZoneInfo
    d=datetime.fromisoformat(date_s).date()
    h,m=map(int,time_s.split(':'))
    return datetime(d.year,d.month,d.day,h,m,tzinfo=ZoneInfo('Europe/Madrid')).astimezone(timezone.utc).strftime('%Y%m%dT%H%M%SZ')

lines=['BEGIN:VCALENDAR','PRODID:-//Anyeli Galva//USC MDP 2026-2027//ES','VERSION:2.0','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Máster Dirección de Proyectos USC 2026-2027','X-WR-TIMEZONE:Europe/Madrid']
for i,r in enumerate(rows):
    code,date_s,tm,title,room=r.split('|')
    a,b=tm.split('-')
    uid=str(uuid.uuid5(uuid.NAMESPACE_URL,f'{code}-{date_s}-{tm}'))+'@usc-mdp'
    lines += ['BEGIN:VEVENT',f'UID:{uid}',f'DTSTAMP:{datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")}',f'DTSTART:{utc_stamp(date_s,a)}',f'DTEND:{utc_stamp(date_s,b)}',f'SUMMARY:{esc(title)}',f'LOCATION:{esc(room)}',f'DESCRIPTION:Código: {code}', 'BEGIN:VALARM','TRIGGER:-PT30M','ACTION:DISPLAY','DESCRIPTION:Clase del Máster USC','END:VALARM','END:VEVENT']
lines.append('END:VCALENDAR')
Path('calendario-mdp-usc-2026-2027.ics').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print(f'Generated {len(rows)} events')
