import React from 'react';
import { Subscriber } from 'react-broadcast';
import {
  Grid,
  Row,
  Col,
  Panel,
  Image,
  ButtonToolbar,
  Button,
  Table,
} from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import { defineMessages, injectIntl } from 'react-intl';
import { event } from './analytics';

import './annie-store.css';

const messages = defineMessages({
  endTime: {
    id: 'Store.endTime',
    defaultMessage: 'Offer ends in {hours} Hours',
  },
  main: {
    id: 'Store.mainAbility',
    defaultMessage: 'Main',
  },
  original: {
    id: 'Store.originalAbility',
    defaultMessage: 'Original',
  },
  brand: {
    id: 'Store.brand',
    defaultMessage: 'Brand',
  },
  brandFavors: {
    id: 'Store.brandFavors',
    defaultMessage: 'Favors',
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
  },
  refresh: {
    id: 'Store.refreshButton.refresh',
    defaultMessage: 'Refresh',
  },
  refreshed: {
    id: 'Store.refreshButton.refreshing',
    defaultMessage: 'Refreshing',
  },
  rarity: {
    id: 'Store.rarity',
    defaultMessage: 'Rarity',
  },
  price: {
    id: 'Store.price',
    defaultMessage: 'Price',
  },
});

const MerchTable = ({ merch, intl, original }) => {
  let rarity = merch.gear.rarity + 1;
  return (
    <Table bordered>
      <tbody>
        <tr>
          <th style={{ verticalAlign: 'middle' }}>
            {intl.formatMessage(messages.price)}
          </th>
          <td>{merch.price}</td>
        </tr>
        <tr>
          <th style={{ verticalAlign: 'middle' }}>
            {intl.formatMessage(messages.rarity)}
          </th>
          <td>{'★'.repeat(rarity)}</td>
        </tr>
        <tr>
          <th style={{ verticalAlign: 'middle' }}>
            {intl.formatMessage(messages.main)}
          </th>
          <td>
            <Image
              src={`https://app.splatoon2.nintendo.net${merch.skill.image}`}
            />
          </td>
        </tr>
        {original != null ? (
          <tr>
            <th style={{ verticalAlign: 'middle' }}>
              {intl.formatMessage(messages.original)}
            </th>
            <td>{original}</td>
          </tr>
        ) : null}
        <tr>
          <th style={{ verticalAlign: 'middle' }}>
            {intl.formatMessage(messages.brand)}
          </th>
          <td>
            <Image
              src={`https://app.splatoon2.nintendo.net${merch.gear.brand.image}`}
            />
          </td>
        </tr>
        <tr>
          <th style={{ verticalAlign: 'middle' }}>
            {intl.formatMessage(messages.brandFavors)}
          </th>
          <td>
            <Image
              src={`https://app.splatoon2.nintendo.net${merch.gear.brand.frequent_skill.image}`}
            />
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

const MerchRight = ({ merch, intl, original }) => {
  const now = new Date().getTime();
  const timeLeftInSeconds = merch.end_time - now / 1000;
  const timeLeftInHours = timeLeftInSeconds / 3600;

  return (
    <Col sm={6} md={6} className="details">
      <Row>
        <Col>
          <h3 style={{ textAlign: 'center', marginTop: 0 }}>
            {merch.gear.name}
            <br />
            <small>
              {intl.formatMessage(messages.endTime, {
                hours: timeLeftInHours.toFixed(2),
              })}
            </small>
          </h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <MerchTable merch={merch} intl={intl} original={original} />
        </Col>
      </Row>
    </Col>
  );
};

const Merch = ({ merch, order, disabled, intl, original }) => {
  return (
    <Col sm={6} md={6} lg={4}>
      <Panel>
        <Panel.Body>
          <Row className="merch">
            <Col
              sm={6}
              md={6}
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
            >
              <Image
                src={`https://app.splatoon2.nintendo.net${merch.gear.image}`}
              />
            </Col>
            <MerchRight merch={merch} intl={intl} original={original} />
          </Row>
          <Row>
            <Col md={12}>
              <Button
                block
                bsStyle={
                  merch.skill.id === merch.gear.brand.frequent_skill.id
                    ? 'success'
                    : 'primary'
                }
                onClick={() => {
                  order(merch.id);
                }}
                disabled={disabled}
              >
                {intl.formatMessage(messages.orderButtonText)}
              </Button>
            </Col>
          </Row>
        </Panel.Body>
      </Panel>
    </Col>
  );
};

const OrderedInfo = ({ order, cancel, cancelled, intl, original }) => {
  return (
    <Row>
      <Col sm={12} md={12} lg={12}>
        <Panel>
          <Panel.Heading>{intl.formatMessage(messages.ordered)}</Panel.Heading>
          <Panel.Body>
            <Row className="merch">
              <Col
                sm={6}
                md={6}
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
              >
                <Image
                  src={`https://app.splatoon2.nintendo.net${order.gear.image}`}
                  className="merch"
                />
              </Col>
              <Col sm={6} md={6} className="details">
                <Row>
                  <Col>
                    <h3 style={{ textAlign: 'center', marginTop: 0 }}>
                      {order.gear.name}
                    </h3>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <MerchTable merch={order} intl={intl} original={original} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Button
                  block
                  bsStyle="warning"
                  onClick={() => {
                    cancel();
                  }}
                >
                  {cancelled
                    ? intl.formatMessage(messages.uncancelButtonText)
                    : intl.formatMessage(messages.cancelButtonText)}
                </Button>
              </Col>
            </Row>
          </Panel.Body>
        </Panel>
      </Col>
    </Row>
  );
};

class AnnieStore extends React.Component {
  state = {
    cancelled: false,
    ordering: false,
    refreshing: false,
  };

  componentDidMount() {
    this.update();
  }

  update = () => {
    event('annie-store', 'refresh');
    this.setState({ refreshing: true });
    this.props.splatnet.comm.updateMerchandise();
    setTimeout(() => this.setState({ refreshing: false }), 2000);
  };

  order = (merchId) => {
    event('annie-store', 'order');
    this.setState({ ordering: true });
    ipcRenderer.send('postApi', `onlineshop/order/${merchId}`, {
      override: '1',
    });
    setTimeout(() => {
      this.setState({ cancelled: false, ordering: true });
      this.props.splatnet.comm.updateMerchandise();
    }, 1000);
  };

  cancel = () => {
    event('annie-store', 'cancel');
    this.setState({ cancelled: !this.state.cancelled });
  };

  render() {
    const { splatnet, intl } = this.props;
    const { cancelled, ordering } = this.state;
    const { merchandises, ordered_info } = splatnet.current.annie;
    const { annieOriginal = [] } = splatnet.current;
    return (
      <Grid fluid style={{ marginTop: 65 }}>
        <Row>
          <Col md={12}>
            <ButtonToolbar style={{ marginBottom: '10px' }}>
              <Button onClick={this.update} disabled={this.state.refreshing}>
                {this.state.refreshing
                  ? intl.formatMessage(messages.refreshed)
                  : intl.formatMessage(messages.refresh)}
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
        {ordered_info != null && !cancelled ? (
          <OrderedInfo
            order={ordered_info}
            cancel={this.cancel}
            cancelled={cancelled}
            intl={intl}
          />
        ) : null}
        <Row>
          {merchandises.map((merch, i) => (
            <Merch
              key={merch.id}
              merch={merch}
              order={this.order}
              disabled={(ordered_info != null && !cancelled) || ordering}
              original={annieOriginal.length > i ? annieOriginal[i] : ''}
              intl={intl}
            />
          ))}
        </Row>
      </Grid>
    );
  }
}

const SubscribedAnnieStore = ({ intl }) => {
  return (
    <Subscriber channel="splatnet">
      {(splatnet) => <AnnieStore splatnet={splatnet} intl={intl} />}
    </Subscriber>
  );
};

export default injectIntl(SubscribedAnnieStore);
