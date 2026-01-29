
import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Divider, Table, Select, Checkbox, Tag, Tooltip } from "antd";
import { FileProtectOutlined, SearchOutlined, DollarOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import serviceMain from "../../service/confirm.service";
import service from "../../service/account.service";
import { useSelector } from "react-redux";
import "../../css/InvoiceConfirm.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import EBilling_DetailModalACPrint from "../Account/EBilling_PrintPayment";
import EBilling_PaymentDetailModal from "./EBilling_PaymentDetailModal";
import EBilling_PaymentCancelModal from "./EBilling_PaymentCancelModal";


dayjs.extend(isBetween);

const { Option } = Select;

interface InvoiceDetail {
  key: React.Key;
  billerby: string;
  billerdate: string;
  date: string;
  documentno: string;
  duedate: string;
  netpaid: number;
  paymenT_TERMS: string;
  receiveD_BILLERBY: string;
  receiveD_BILLERDATE: string;
  taxid: string;
  totaL_AMOUNT: number;
  vendorcode: string;
  vendorname: string;
  whtax: number;
  status: string;
  addreS1: string;
  addreS2: string;
  faxno: string;
  zipcode: string;
  telno: string;
}

export default function EBilling_Payment() {
  const auth = useSelector((state: any) => state.reducer.authen);
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().startOf("month"));
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
  const [dataSource, setDataSource] = useState<InvoiceDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDetailModalOpenDetail, setIsDetailModalOpenDetail] = useState(false);
  const [isDetailModalOpenPrint, setIsDetailModalOpenPrint] = useState(false);
  const [detailRecordDetail, setDetailRecordDetail] = useState<InvoiceDetail | null>(null);
  const [detailRecordPrint, setDetailRecordPrint] = useState<InvoiceDetail | null>(null);
  const [status, setStatus] = useState<string>("CONFIRM");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [vendor, setVendor] = useState<string>("%");
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [ACType, setACType] = useState<string>("%");
  const rowKeys = dataSource.map(item => item.vendorcode);
  const allChecked = selectedRowKeys.length === rowKeys.length && rowKeys.length > 0;
  const indeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < rowKeys.length;
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);




  useEffect(() => {

  }, [auth.username]);

  useEffect(() => {
    serviceMain.getVendor().then((res) => {
      try {
        setVendorList(res.data);
      } catch (error) {
        console.error(error);
      }
    });
  }, []);



  const onSearch = async () => {
    if (!fromDate || !toDate) {
      Swal.fire({ icon: "warning", title: "Please select Document dates." });
      return;
    }

    try {
      setLoading(true);
      const res = await service.HeaderPayment({
        venderCode: vendor,
        invoiceDateFrom: fromDate.format("YYYY-MM-DD"),
        invoiceDateTo: toDate.format("YYYY-MM-DD"),
        status: status,
        role: auth.incharge.trim(),
        actype: ACType
      });

      const filteredData = res.data


      setDataSource(filteredData);
      setSelectedRowKeys([]);

      console.log("filteredData", filteredData)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // เลือก row ที่ถูก select
  const payload = dataSource.filter((item) => selectedRowKeys.includes(item.vendorcode)).map((item) => ({
    vendorCode: item.vendorcode,
    status: item.status
  }));



  const handlePayment = async () => {
    try {
      setLoading(true);


      await service.PaymentBilling({
        vendorCode: payload.map((p) => p.vendorCode),
        status: payload.map((p) => p.status),
        issuedBy: auth.incharge.trim(),
        invoiceDateFrom: fromDate.format("YYYY-MM-DD"),
        invoiceDateTo: toDate.format("YYYY-MM-DD"),
      });

      Swal.fire("สำเร็จ!", "PAYMENT เรียบร้อยแล้ว", "success");

      onSearch();
      setSelectedRowKeys([]);
    } catch (error: any) {
      console.error(error);
      Swal.fire("ล้มเหลว!", error.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    } finally {
      setLoading(false);
    }
  };



  const columns = [
    {
      title: "No", width: 60, align: "center", render: (_: any, __: any, index: number) => index + 1,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "DUE DATE", dataIndex: "duedate", width: 120, align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "TAX ID", dataIndex: "taxid", width: 120, align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "VENDOR CODE", dataIndex: "vendorcode", width: 150, align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "VENDER NAME",
      dataIndex: "vendorname",
      width: 400,
      align: "center",
      render: (value: any) => <div style={{ textAlign: "left" }}>{value}</div>,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "PAYMENT TERMS", dataIndex: "paymenT_TERMS", width: 150, align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totaL_AMOUNT",
      width: 150,
      align: "right",
      render: (val: any) => Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 }),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "W/H TAX",
      dataIndex: "whtax",
      width: 120,
      align: "right",
      render: (val: any) => Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 }),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "NET PAID",
      dataIndex: "netpaid",
      width: 150,
      align: "right",
      render: (val: any) => Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 }),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 100,
      align: "center",
      fixed: "right", // ติดขวา
      render: (value: string) => {
        if (!value) return "-";

        const raw = value.trim();
        const status = raw.toLowerCase();

        if (status === "payment") {
          return <Tag color="green">PAYMENT</Tag>;
        }

        if (status === "confirm") {
          return <Tag color="blue">CONFIRM</Tag>;
        }

        if (raw.toUpperCase() === "WAITING_VENDOR") {
          return <Tag color="orange">Waiting Vendor Confirm</Tag>;
        }

        if (raw.toUpperCase() === "WAITING_DCI") {
          return <Tag color="gold">Waiting DCI Confirm</Tag>;
        }

        if (raw.toUpperCase() === "CANCEL_PAYMENT") {
          return <Tag color="red">CANCEL PAYMENT</Tag>;
        }

        return <Tag>{value}</Tag>; // อื่นๆ แสดงตามเดิม
      },
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "DETAIL",
      width: 80,
      align: "center",
      render: (_: any, record: InvoiceDetail) => (
        <SearchOutlined
          style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
          onClick={() => {
            setDetailRecordDetail(record);
            setIsDetailModalOpenDetail(true);
          }}
        />
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Checkbox
            checked={allChecked}
            indeterminate={indeterminate}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRowKeys(rowKeys); // เลือกทั้งหมด
              } else {
                setSelectedRowKeys([]); // ยกเลิกทั้งหมด
              }
            }}
          />
          <span style={{ fontWeight: "bold" }}>SELECT</span>
        </div>
      ),
      width: 120,
      align: "center",
      render: (_: any, record: InvoiceDetail) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.vendorcode)} // ✅ ใช้ vendorcode เป็น key
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.vendorcode]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.vendorcode));
            }
          }}
        />
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          textAlign: "center",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "CANCEL",
      width: 90,
      align: "center",
      render: (_: any, record: InvoiceDetail) =>
        record.status === "PAYMENT" ? (
          <Button
            danger
            size="small"
            style={{
              backgroundColor: 'red',
              border: 'red',
              color: 'white'
            }}
            onClick={() => {
              setDetailRecordDetail(record);
              setIsCancelModalOpen(true);
            }}
          >
            Cancel
          </Button>
        ) : null,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
          fontWeight: "bold",
        },
      }),
    }
  ];

  const getGrandTotalAmount = () => {
    const total = dataSource.reduce((sum, item) => sum + Number(item.totaL_AMOUNT ?? 0), 0);
    return total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getGrandTotalWHTax = () => {
    const total = dataSource.reduce((sum, item) => sum + Number(item.whtax ?? 0), 0);
    return total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getGrandTotalNetPaid = () => {
    const total = dataSource.reduce((sum, item) => sum + Number(item.netpaid ?? 0), 0);
    return total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // ฟังก์ชัน Export PDF
  const exportPDF = () => {
    setDetailRecordPrint(dataSource);
    setIsDetailModalOpenPrint(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedRowKeys([]); // ✅ เคลียร์ checkbox ทุกครั้งที่ปิด
  };



  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <DollarOutlined style={{ fontSize: 28, marginRight: 10, color: "#1890ff" }} />
        <p style={{ fontWeight: 600, fontSize: 20 }}>Confirm Billing Payment</p>
      </div>

      <Divider style={{ borderColor: "#d0cdcd", marginTop: 8 }} />

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Form layout="inline" style={{ alignItems: "center" }}>

          <Form.Item style={{ marginRight: 10, fontWeight: 500, fontSize: 16, height: 40, display: "flex", alignItems: "center" }}>
            Invoice Date
          </Form.Item>


          <Form.Item
            style={{
              marginRight: 5,
              height: 40,
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            From :
          </Form.Item>

          <Form.Item>
            <DatePicker
              format="DD/MM/YYYY"
              value={fromDate}
              onChange={setFromDate}
              style={{ height: 32 }}
            />
          </Form.Item>


          <Form.Item
            style={{
              margin: "0 5px",
              height: 32,
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            To :
          </Form.Item>

          <Form.Item>
            <DatePicker
              format="DD/MM/YYYY"
              value={toDate}
              onChange={setToDate}
              style={{ height: 32 }}
            />
          </Form.Item>

          <span style={{ margin: "0 3px", fontWeight: 500, fontSize: 14 }}>Select Vendor :</span>
          <Form.Item>
            <Select
              showSearch
              value={vendor}
              onChange={setVendor}
              style={{ width: 350, height: 32 }}
              placeholder="เลือก Vendor"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              <Select.Option value="%">All</Select.Option>

              {vendorList.map((item, index) => (
                <Select.Option key={index} value={item.vender.trim()}>
                  {item.vdname}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <span style={{ margin: "0 3px", fontWeight: 500, fontSize: 14 }}>AC Type :</span>
          <Form.Item>
            <Select value={ACType} onChange={setACType} style={{ width: 200, height: 32 }}>
              <Option value="%">ALL</Option>
              <Option value="G">G : GENERAL PURCHASE</Option>
              <Option value="O">O : OTHERS</Option>
              <Option value="R">R : RAW MATERIAL</Option>
            </Select>
          </Form.Item>


          <Form.Item
            style={{
              margin: "0 5px",
              height: 32,
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            Status :
          </Form.Item>

          <Form.Item>
            <Select value={status} onChange={setStatus} style={{ width: 200, height: 32 }}>
              <Option value="CANCEL_PAYMENT">CANCEL</Option>
              <Option value="CONFIRM">CONFIRM</Option>
              <Option value="PAYMENT">PAYMENT</Option>
            </Select>
          </Form.Item>

          {/* Search */}
          <Form.Item>
            <Button
              type="primary"
              onClick={onSearch}
              loading={loading}
              style={{ height: 32 }}
            >
              Search
            </Button>
          </Form.Item>

          {/* Export PDF */}
          <Form.Item>
            <Button
              onClick={exportPDF}
              style={{
                backgroundColor: "gray",
                borderColor: "gray",
                height: 32,
                color: "white"
              }}
            >
              Export PDF
            </Button>
          </Form.Item>


          <Form.Item>
            <Button
              onClick={handlePayment}
              disabled={
                !(dataSource[0]?.status === "CONFIRM" && selectedRowKeys.length > 0)
              }
              style={{
                backgroundColor:
                  dataSource[0]?.status === "CONFIRM" && selectedRowKeys.length > 0
                    ? "#52c41a"
                    : "#ccc",
                borderColor:
                  dataSource[0]?.status === "CONFIRM" && selectedRowKeys.length > 0
                    ? "#52c41a"
                    : "#ccc",
                height: 32,
                color: "white",
                cursor:
                  dataSource[0]?.status === "CONFIRM" && selectedRowKeys.length > 0
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              Payment
            </Button>
          </Form.Item>


        </Form>
      </div>




      <div style={{ maxHeight: 600 }} className="customTable">
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: "max-content", y: 600 }}
          tableLayout="fixed"
          sticky
          bordered
          pagination={false}
          loading={loading}
          rowClassName={(record: MData) => {
            const status = record.status?.trim().toLowerCase();
          
            if (status === "payment") return "row-payment";
            if (status === "confirm") return "row-confirm";
            if (status === "waiting") return "row-waiting";
            if (status === "reject") return "row-reject";
            if (status === "cancel_payment") return "row-reject";

            return "";
          }}
          summary={() => (
            <Table.Summary fixed="bottom">
              <Table.Summary.Row style={{ backgroundColor: "#fafafa", fontWeight: 700 }}>
                <Table.Summary.Cell colSpan={6} align="center">Grand Total</Table.Summary.Cell>
                <Table.Summary.Cell align="right">{getGrandTotalAmount()}</Table.Summary.Cell>
                <Table.Summary.Cell align="right">{getGrandTotalWHTax()}</Table.Summary.Cell>
                <Table.Summary.Cell align="right">{getGrandTotalNetPaid()}</Table.Summary.Cell>
                <Table.Summary.Cell ></Table.Summary.Cell>
                <Table.Summary.Cell ></Table.Summary.Cell>
                <Table.Summary.Cell ></Table.Summary.Cell>
                <Table.Summary.Cell ></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>

      <EBilling_PaymentDetailModal
        open={isDetailModalOpenDetail}
        onClose={() => setIsDetailModalOpenDetail(false)}
        invoiceDetail={detailRecordDetail}
        refreshData={onSearch}
        invoiceDateFrom={fromDate.format("YYYY-MM-DD")}
        invoiceDateTo={toDate.format("YYYY-MM-DD")}
      />

      <EBilling_PaymentCancelModal
        open={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        invoiceDetail={detailRecordDetail}
        refreshData={onSearch}
        invoiceDateFrom={fromDate.format("YYYY-MM-DD")}
        invoiceDateTo={toDate.format("YYYY-MM-DD")}
        selectedRowKeys={selectedRowKeys}
        payload={payload}
      />



      <EBilling_DetailModalACPrint
        open={isDetailModalOpenPrint}
        onClose={() => setIsDetailModalOpenPrint(false)}
        invoiceDetail={detailRecordPrint}
      />
    </div>
  );
}
