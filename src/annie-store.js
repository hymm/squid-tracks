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
import { describeMessages, injectIntl } from 'react-intl';

import './annie-store.css';

const messages = describeMessages({
    endTime: {
        id: 'Store.endTime',
        defaultMessage: 'End Time: ',
    },
    main: {
        id: 'Store.mainAbility',
        defaultMessage: 'Main: ',
    },
    brand: {
        id: 'Store.brand',
        defaultMessage: 'Brand: ',
    },
    brandFavors: {
        id: 'Store.brandFavors',
        defaultMessage: 'Favors: ',
    },
    ordered: {
        id: 'Store.GearOrderedTitle',
        defaultMessage: 'Ordered',
    },
    orderButtonText: {
        id: 'Store.orderButton.text',
        defaultMessage: 'Order',
    },
    cancelButtonText: {
        id: 'Store.cancelButton.text',
        defaultMessage: 'Cancel',
    },
    uncancelButtonText: {
        id: 'Store.cancelButton.uncancel',
        defaultMessage: 'Uncancel',
    }
});

const Merch = ({ merch, order, disabled, intl }) => {
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
              {`${intl.formatMessage(messages.endTime)}${merch.end_time}`}
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              {intl.formatMessage(messages.main)}
              <Image
                src={`https://app.splatoon2.nintendo.net${merch.skill.image}`}
              />
            </Col>
            <Col md={4}>
              {intl.formatMessage(messages.brand)}}
              <Image
                src={`https://app.splatoon2.nintendo.net${merch.gear.brand
                  .image}`}
              />
            </Col>
            <Col md={4}>
              {intl.formatMessage(messages.brandFavors)}
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
                {intl.formatMessage(messages.orderButtonText)}
              </Button>
            </Col>
          </Row>
        </Grid>
      </Thumbnail>
    </Col>
  );
};

const OrderedInfo = ({ order, cancel, cancelled, intl }) => {
  return (
    <Row>
      <Col sm={12} md={12} lg={12}>
        <Panel header={intl.formatMessage(messages.ordered)}>
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
                  {intl.formatMessage(messages.main)}
                  <Image
                    src={`https://app.splatoon2.nintendo.net${order.skill
                      .image}`}
                  />
                </Col>
                <Col md={4} style={{ textAlign: 'center' }}>
                  {intl.formatMessage(messages.brand)}
                  <Image
                    src={`https://app.splatoon2.nintendo.net${order.gear.brand
                      .image}`}
                  />
                </Col>
                <Col md={4} style={{ textAlign: 'center' }}>
                  {intl.formatMessage(messages.brandFavors)}
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
                    {
                        cancelled
                        ? intl.formatMessage(messages.uncancelButtonText)
                        : intl.formatMessage(messages.cancelButtonText)
                    }
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
    const { splatnet, intl } = this.props;
    const { cancelled, ordering } = this.state;
    const { merchandises, ordered_info } = splatnet.current.annie;

    return (
      <Grid fluid style={{ marginTop: 65 }}>
        {ordered_info != null && !cancelled
          ? <OrderedInfo
              order={ordered_info}
              cancel={this.cancel}
              cancelled={cancelled}
              intl={intl}
            />
          : null}
        <Row>
          {merchandises.map(merch =>
            <Merch
              key={merch.id}
              merch={merch}
              order={this.order}
              disabled={(ordered_info != null && !cancelled) || ordering}
              intl={intl}
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
      {splatnet => injectIntl(<AnnieStore splatnet={splatnet} />)}
    </Subscriber>
  );
};

export default SubscribedAnnieStore;
