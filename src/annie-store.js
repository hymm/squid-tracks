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

const Merch = ({ merch, order, disabled }) => {
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
                disabled={disabled}
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

const OrderedInfo = ({ order, cancel, cancelled }) => {
  return (
    <Row>
      <Col sm={12} md={12} lg={12}>
        <Panel header={'Ordered'}>
          <Thumbnail
            src={`https://app.splatoon2.nintendo.net${order.gear.image}`}
            className="merch"
          >
            <h3 style={{ textAlign: 'center', marginTop: 0 }}>
              {order.gear.name}
            </h3>
            <Grid fluid>
              <Row>
                <Col md={4} style={{ textAlign: 'center' }}>
                  {`Main: `}
                  <Image
                    src={`https://app.splatoon2.nintendo.net${order.skill
                      .image}`}
                  />
                </Col>
                <Col md={4} style={{ textAlign: 'center' }}>
                  {`Brand: `}
                  <Image
                    src={`https://app.splatoon2.nintendo.net${order.gear.brand
                      .image}`}
                  />
                </Col>
                <Col md={4} style={{ textAlign: 'center' }}>
                  {`Favors: `}
                  <Image
                    src={`https://app.splatoon2.nintendo.net${order.gear.brand
                      .frequent_skill.image}`}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col md={12}>
                  <Button
                    block
                    bsStyle="warning"
                    onClick={() => {
                      cancel();
                    }}
                  >
                    {cancelled ? 'Uncancel' : 'Cancel'}
                  </Button>
                </Col>
              </Row>
            </Grid>
          </Thumbnail>
        </Panel>
      </Col>
    </Row>
  );
};

class AnnieStore extends React.Component {
  state = {
    cancelled: false,
    ordering: false
  };

  componentDidMount() {
    this.props.splatnet.comm.updateMerchandise();
  }

  order = merchId => {
    this.setState({ ordering: true });
    ipcRenderer.send('postApi', `onlineshop/order/${merchId}`, {
      override: '1'
    });
    setTimeout(() => {
      this.setState({ cancelled: false, ordering: true });
      this.props.splatnet.comm.updateMerchandise();
    }, 1000);
  };

  cancel = () => {
    this.setState({ cancelled: !this.state.cancelled });
  };

  render() {
    const { splatnet } = this.props;
    const { cancelled, ordering } = this.state;
    const { merchandises, ordered_info } = splatnet.current.annie;

    return (
      <Grid fluid style={{ marginTop: 65 }}>
        {ordered_info != null && !cancelled
          ? <OrderedInfo
              order={ordered_info}
              cancel={this.cancel}
              cancelled={cancelled}
            />
          : null}
        <Row>
          {merchandises.map(merch =>
            <Merch
              key={merch.id}
              merch={merch}
              order={this.order}
              disabled={(ordered_info != null && !cancelled) || ordering}
            />
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
