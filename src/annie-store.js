import React from 'react';
import { Subscriber } from 'react-broadcast';
import { Grid, Row, Col, Panel, Image } from 'react-bootstrap';

const SplatnetImg = ({ url, ...props }) =>
  <Image responsive src={`https://app.splatoon2.nintendo.net${url}`} />;

const Merch = ({ merch }) => {
  return (
    <Col sm={6} md={6} lg={3}>
      <Panel>
        {`End Time: ${merch.end_time}`}
        {`Name: ${merch.gear.name}`}
        {`Main: ${merch.skill.name}`}
        <SplatnetImg url={merch.skill.image} />
        <SplatnetImg url={merch.gear.image} />
        <SplatnetImg url={merch.gear.brand.image} />
        <SplatnetImg url={merch.gear.brand.frequent_skill.image} />
      </Panel>
    </Col>
  );
};

class AnnieStore extends React.Component {
  componentDidMount() {
    this.props.splatnet.comm.updateMerchandise();
  }

  render() {
    const { splatnet } = this.props;
    console.log(splatnet);
    const { merchandises } = splatnet.current.annie;

    return (
      <Grid fluid style={{ marginTop: 65 }}>
        <Row>
          {merchandises.map(merch => <Merch key={merch.id} merch={merch} />)}
        </Row>
      </Grid>
    );
  }
}

const SubscribedAnnieStore = () => {
  return (
    <Subscriber channel="splatnet">
      {splatnet => <AnnieStore splatnet={splatnet} />}
    </Subscriber>
  );
};

export default SubscribedAnnieStore;
