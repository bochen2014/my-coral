import React, { Component } from "react";
import { connect } from "react-redux";
import { refreshPage } from "../redux/refresh";
import fetch from "../common/fetch";

class Appointments extends Component {
  state = {
    loading: false,
    appointments: {}
  };
  loadAppointments(cb) {
    this.setState({
      loading: true
    });
    fetch("/appointments").then(result => {
      const { appointments, timeStamp } = result;
      this.setState({
        loading: false,
        appointments,
        timeStamp
      });
      if(cb){
        cb();
      }
    });
  }

  componentWillMount() {
    this.loadAppointments();
  }

  componentWillReceiveProps(nextProps) {
    const { refreshRequired: wasRefreshRequired } = this.props;
    const { refreshRequired, refreshPage } = nextProps;
    if (refreshRequired && !wasRefreshRequired) {
      this.loadAppointments(() => { refreshPage(false )});
    }
  }

  renderAppointments = (appotinments, timeStamp) => (
    <div>
      {appotinments.map((p, index) => (
        <div key={`_apmt_${index}`} style={{ margin: "10px" }}>
          {p}
        </div>
      ))}
      <div style={{ marginTop: "60px" }}>lastUpdated: {timeStamp}</div>
    </div>
  );

  render() {
    const { loading, appointments, timeStamp } = this.state;
    return (
      <div
        style={{
          width: "500px",
          height: "300px",
          border: "1px solid red",
          margin: "20px",
          float: "left"
        }}
      >
        {loading
          ? "loading appointments"
          : this.renderAppointments(appointments, timeStamp)}
      </div>
    );
  }
}

export default connect(
  state => ({
    refreshRequired: state.refresh.required
  }),
  {
    refreshPage
  }
)(Appointments);