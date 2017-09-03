import React from 'react';
import { Subscriber } from 'react-broadcast';
import {
  Grid,
  Row,
  Col,
  Panel,
  Thumbnail,
  Image,
  Button
} from 'react-bootstrap';
import { ipcRenderer } from 'electron';

import './annie-store.css';

const Merch = ({ merch, order }) => {
  return (
    <Col sm={6} md={6} lg={3}>
      <Thumbnail
        src={`https://app.splatoon2.nintendo.net${merch.gear.image}`}
        className="merch"
      >
        <h3 style={{ textAlign: 'center', marginTop: 0 }}>
          {merch.gear.name}
        </h3>
        <Grid fluid>
          <Row>
            <Col md={12}>
              {`End Time: ${merch.end_time}`}
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              {`Main: `}
              <Image
                src={`https://app.splatoon2.nintendo.net${merch.skill.image}`}
              />
            </Col>
            <Col md={4}>
              {`Brand: `}
              <Image
                src={`https://app.splatoon2.nintendo.net${merch.gear.brand
                  .image}`}
              />
            </Col>
            <Col md={4}>
              {`Favors: `}
              <Image
                src={`https://app.splatoon2.nintendo.net${merch.gear.brand
                  .frequent_skill.image}`}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col md={12}>
              <Button
                block
                bsStyle="primary"
                onClick={() => {
                  order(merch.id);
                }}
              >
                Order
              </Button>
            </Col>
          </Row>
        </Grid>
      </Thumbnail>
    </Col>
  );
};

class AnnieStore extends React.Component {
  componentDidMount() {
    this.props.splatnet.comm.updateMerchandise();
  }

  order = merchId => {
    ipcRenderer.send('postApi', `order/merchandise/${merchId}`, {
      overrride: 1
    });
  };

  render() {
    const { splatnet } = this.props;
    const { merchandises } = splatnet.current.annie;

    return (
      <Grid fluid style={{ marginTop: 65 }}>
        <Row>
          {merchandises.map(merch =>
            <Merch key={merch.id} merch={merch} order={this.order} />
          )}
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
