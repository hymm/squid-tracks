import React, { useEffect } from 'react';
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl';
import {
  Container,
  Row,
  Col,
  Image,
  Card,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import CoopResults from './components/coop-results-summary';
import CoopTrend from './components/coop-trend';
import { useSplatnet } from './splatnet-provider';
import './salmon.css';

const SalmonTime = ({ unixTime }) => {
  return (
    <React.Fragment>
      <FormattedDate
        value={new Date(unixTime * 1000)}
        month="numeric"
        day="2-digit"
      />{' '}
      <FormattedTime value={new Date(unixTime * 1000)} />
    </React.Fragment>
  );
};

const TodayMarker = ({ day }) => {
  const now = new Date().getTime() / 1000;
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const unixStart = dayStart.getTime() / 1000;
  const unixEnd = unixStart + 86400;

  if (now < unixStart || now > unixEnd) {
    return null;
  }

  const percent = (now - unixStart) / 864;

  return <div className="currentTime" style={{ top: `${percent}%` }} />;
};

const SalmonDay = ({ schedules, unixTime }) => {
  if (unixTime == null) {
    return <div className="salmon-day" />;
  }

  const { times, day } = getTimesWithinDay(unixTime, schedules);
  let lastTime = times[0];
  return (
    <div className="salmon-day">
      {times.map((time) => {
        if (time === lastTime) {
          return null;
        }

        const height = (time.time - lastTime.time) / 864;
        const dayStart = lastTime.dayStart;
        const dayEnd = time.dayEnd;
        lastTime = time;

        if (time.isStart) {
          return (
            <div
              key={`start.${time.time}`}
              className={`cell`}
              style={{ height: `${height}%` }}
            />
          );
        }

        return (
          <OverlayTrigger
            overlay={
              <Tooltip id={schedules[time.scheduleNum].start_time}>
                <SalmonTime unixTime={schedules[time.scheduleNum].start_time} />
                {` - `}
                <SalmonTime unixTime={schedules[time.scheduleNum].end_time} />
              </Tooltip>
            }
            placement="top"
            delayShow={300}
            delayHide={150}
            key={`day.${time.time}`}
          >
            <div
              className={`cell work ${dayStart ? 'day-start' : ''} ${
                dayEnd ? 'day-end' : ''
              }`}
              style={{ height: `${height}%` }}
            />
          </OverlayTrigger>
        );
      })}
      <div className="date">{day.getDate()}</div>
      <TodayMarker day={day} />
    </div>
  );
};

function getTimesWithinDay(unixTime, schedules) {
  const day = new Date(unixTime * 1000);
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const unixStart = dayStart.getTime() / 1000;
  const unixEnd = unixStart + 86400;
  const times = [];

  let allDay = false;
  let allDayNum = -1;
  for (let i = 0; i < schedules.length; i++) {
    const s = schedules[i];
    if (s.start_time >= unixStart && s.start_time < unixEnd) {
      times.push({ time: s.start_time, isStart: true, scheduleNum: i });
    }

    if (s.end_time > unixStart && s.end_time <= unixEnd) {
      times.push({ time: s.end_time, isStart: false, scheduleNum: i });
    }

    if (unixStart >= s.start_time && unixEnd <= s.end_time) {
      allDay = true;
      allDayNum = i;
    }
  }

  if (times.length > 0) {
    times.unshift({
      time: unixStart,
      isStart: !times[0].isStart,
      scheduleNum: times[0].scheduleNum,
      dayStart: true,
    });
    times.push({
      time: unixEnd,
      isStart: !times[times.length - 1].isStart,
      scheduleNum: times[times.length - 1].scheduleNum,
      dayEnd: true,
    });
  }

  if (allDay) {
    times.push({
      time: unixStart,
      isStart: true,
      scheduleNum: allDayNum,
      dayStart: true,
    });
    times.push({
      time: unixEnd,
      isStart: false,
      scheduleNum: allDayNum,
      dayEnd: true,
    });
  }

  return { times, day };
}

const SalmonCalendar = ({ schedules }) => {
  if (schedules == null || schedules.length <= 0) {
    return null;
  }

  const startDate = new Date(schedules[0].start_time * 1000);
  const startDow = startDate.getDay();
  const endDate = new Date(schedules[schedules.length - 1].end_time * 1000);

  const calendar = [];
  // pad start of week
  let currentWeek = [];
  for (let i = 0; i < startDow; i++) {
    currentWeek.push(<SalmonDay key={`blank.${i}`} />);
  }

  for (let i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
    if (i.getDay() === 0) {
      currentWeek = [];
    }
    currentWeek.push(
      <SalmonDay
        key={i.getDate()}
        unixTime={i.getTime() / 1000}
        schedules={schedules}
      />
    );
    if (i.getDay() === 6) {
      calendar.push(<div key={i.getDate()}>{currentWeek}</div>);
    }
  }
  if (currentWeek.length < 7) {
    calendar.push(currentWeek);
  }

  return (
    <div className="salmon-calendar">
      <div>
        <div className="salmon-day header">S</div>
        <div className="salmon-day header">M</div>
        <div className="salmon-day header">T</div>
        <div className="salmon-day header">W</div>
        <div className="salmon-day header">T</div>
        <div className="salmon-day header">F</div>
        <div className="salmon-day header">S</div>
      </div>
      {calendar}
    </div>
  );
};

const SalmonDetail = ({ detail }) => {
  const now = new Date().getTime() / 1000;
  const active = now < detail.end_time && now > detail.start_time;
  return (
    <Card>
      <Card.Header
        style={
          active ? { background: 'darkorange', color: 'white' } : undefined
        }
      >
        {active ? (
          <FormattedMessage id="salmon.active" defaultMessage="Active until " />
        ) : (
          <React.Fragment>
            <FormattedDate
              value={new Date(detail.start_time * 1000)}
              month="numeric"
              day="2-digit"
            />{' '}
            <FormattedTime value={new Date(detail.start_time * 1000)} />
            {' - '}
          </React.Fragment>
        )}
        <FormattedDate
          value={new Date(detail.end_time * 1000)}
          month="numeric"
          day="2-digit"
        />{' '}
        <FormattedTime value={new Date(detail.end_time * 1000)} />
      </Card.Header>
      <Card.Body>
        <h4 style={{ marginTop: 0 }}>{detail.stage.name}</h4>
        <Image
          src={`https://app.splatoon2.nintendo.net${detail.stage.image}`}
          style={{ maxHeight: 100, marginBottom: 10 }}
          alt={detail.stage.name}
        />
        <br />
        {detail.weapons.map((weapon, i) =>
          weapon.coop_special_weapon != null ? (
            <Image
              key={i}
              src={`https://app.splatoon2.nintendo.net${weapon.coop_special_weapon.image}`}
              style={{ maxHeight: 40 }}
              alt={weapon.coop_special_weapon.name}
            />
          ) : (
            <Image
              key={i}
              src={`https://app.splatoon2.nintendo.net${weapon.weapon.thumbnail}`}
              style={{ maxHeight: 40 }}
              alt={weapon.weapon.name}
            />
          )
        )}
      </Card.Body>
    </Card>
  );
};

export default function Salmon() {
  const splatnet = useSplatnet();
  useEffect(splatnet.comm.updateCoop, []);
  const { coop_schedules } = splatnet?.current;
  return (
    <Container fluid style={{ paddingTop: '1rem' }}>
      <Row>
        <Col md={12}>
          <h1 style={{ marginTop: 0 }}>
            <FormattedMessage
              id="salmon.title"
              defaultMessage="Shift Schedule"
            />
          </h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <SalmonCalendar schedules={coop_schedules.schedules} />
        </Col>
        {coop_schedules.details.map((d) => (
          <Col key={d.start_time}>
            <SalmonDetail detail={d} />
          </Col>
        ))}
      </Row>
      <Row>
        <Col xs={12} sm={6} md={4} lg={3}>
          <CoopResults />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <CoopTrend />
        </Col>
      </Row>
    </Container>
  );
}
