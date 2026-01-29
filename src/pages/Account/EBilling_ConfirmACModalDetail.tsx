
import React, { useEffect, useState } from "react";
import { Modal, Table, Tag, Button, Checkbox } from "antd";
import serviceMain from "../../service/confirm.service";
import service from "../../service/account.service";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import EBilling_ConfirmACDetailPrint from "./EBilling_ConfirmACDetailPrint";

interface InvoiceDetail {
  documentno: string;
  invoiceno: string;
  invoicedate: string;
  duedate: string;
  vendorcode: string;
  vendorname: string;
  paymenT_TERMS: string;
  currency: string;
  amtb: number;
  totalamount: number;
  status: string;
  filE_NAME?: string;
  remark?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  refreshData: () => void;
  invoiceDetail?: any;
}

const EBilling_ConfirmACModalDetail: React.FC<Props> = ({
  open,
  onClose,
  invoiceDetail,
  refreshData,
}) => {
  const auth = useSelector((state: any) => state.reducer.authen);
  const [dataSource, setDataSource] = useState<InvoiceDetail[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const allKeys = dataSource.map((item: any) => item.key);
  const isAllSelected = allKeys.length > 0 && selectedKeys.length === allKeys.length;
  const isIndeterminate = selectedKeys.length > 0 && selectedKeys.length < allKeys.length;


  useEffect(() => {
    if (open && invoiceDetail?.documentno)
      fetchData();
  }, [open, invoiceDetail]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await service.ReportConfirmDetail({ documentNo: invoiceDetail.documentno, });

      const mapped = res.data.map((item: InvoiceDetail) => ({ ...item, key: item.invoiceno, }));
      setDataSource(mapped);


    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "NO", width: 30, align: "center", render: (_: any, __: any, index: number) => index + 1,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "INVOICE NO", width: 120, align: "center", dataIndex: "invoiceno", key: "invoiceno", fixed: "left", onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "INVOICE DATE", width: 120, align: "center", dataIndex: "invoicedate", key: "invoicedate", onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "VENDOR NAME",
      width: 300,
      align: "center",
      dataIndex: "vendorname",
      key: "vendorname",
      render: (value: any) => (
        <div style={{ textAlign: "left" }}>
          {value || "-"}
        </div>
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "PAYMENT TERMS", width: 150, align: "center", dataIndex: "paymenT_TERMS", key: "paymenT_TERMS", onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "DUE DATE", width: 120, align: "center", dataIndex: "duedate", key: "duedate", onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "CURRENCY", width: 120, align: "center", dataIndex: "currency", key: "currency", onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "AMOUNT (BAHT)",
      dataIndex: "amtb",
      width: 120,
      align: "center",
      render: (value: any) => (
        <div style={{ textAlign: "right" }}>
          {value ? Number(value).toLocaleString() : "-"}
        </div>
      ), onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "VAT IN",
      dataIndex: "totalvat",
      width: 100,
      align: "center",
      render: (value: any) => (
        <div style={{ textAlign: "right" }}>
          {value ? Number(value).toLocaleString() : "-"}
        </div>
      ), onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "W/H TAX RATE %", width: 150, align: "center", dataIndex: "rate", key: "rate", onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "W/H TAX",
      dataIndex: "whtax",
      width: 120,
      align: "center",
      render: (value: any) => (
        <div style={{ textAlign: "right" }}>
          {value ? Number(value).toLocaleString() : "-"}
        </div>
      ), onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalamount",
      width: 150,
      align: "center",
      render: (value: any) => (
        <div style={{ textAlign: "right" }}>
          {value ? Number(value).toLocaleString() : "-"}
        </div>
      ), onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      align: "center",
      fixed: "right", // ติดขวา
      render: (value: string) => {
        if (!value) return "-";

        const raw = value.trim();
        const status = raw.toLowerCase();

        if (status === "payment") {
          return <Tag color="green">Payment</Tag>;
        }

        if (status === "confirm") {
          return <Tag color="blue">Confirm</Tag>;
        }

        if (status === "REJECT_AC") {
          return <Tag color="red">Reject</Tag>;
        }


        if (raw.toUpperCase() === "WAITING_DCI") {
          return <Tag color="gold">Waiting DCI Confirm</Tag>;
        }

        return <Tag>{value}</Tag>; // อื่นๆ แสดงตามเดิม
      },
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Checkbox
            indeterminate={isIndeterminate}
            checked={isAllSelected}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedKeys(allKeys);
              } else {
                setSelectedKeys([]);
              }
            }}
          />
          <span>SELECT</span>
        </div>
      ),
      key: "select",
      width: 120,
      align: "center",
      render: (_: any, record: InvoiceDetail) => (
        <Checkbox
          checked={selectedKeys.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedKeys([...selectedKeys, record.key]);
            } else {
              setSelectedKeys(
                selectedKeys.filter((k) => k !== record.key)
              );
            }
          }}
        />
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    },
    {
      title: "REMARK",
      width: 300,
      dataIndex: "remark",
      key: "remark",
      align: "center",
      render: (value: string | undefined, record: InvoiceDetail) => (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => {
            const newData = dataSource.map((item) => {
              if (item.key === record.key) {
                return { ...item, remark: e.target.value }; // update remark ของ row นี้
              }
              return item;
            });
            setDataSource(newData);
          }}
          style={{ width: "100%", padding: 4, backgroundColor: "#fff3a8" }}
        />
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "rgb(167 213 255)",
          color: "black",
        },
      }),
    }
  ];


  const handleconfirmbilling = async () => {
    try {
      setLoading(true);

      // เลือก row ที่ถูก select
      const payload = dataSource.filter((item) => selectedKeys.includes(item.key)).map((item) => ({
        invoiceNo: item.invoiceno,
        remark: item.remark || ""
      }));

      await service.ConfirmBilling({
        invoiceNos: payload.map((p) => p.invoiceNo),
        remarks: payload.map((p) => p.remark),
        issuedBy: auth.incharge.trim(),
        documentNo: invoiceDetail?.documentno
      });

      Swal.fire("สำเร็จ!", "บันทึกข้อมูลเรียบร้อยแล้ว", "success");

      refreshData();
      onClose();
    } catch (error: any) {
      console.error(error);
      Swal.fire("ล้มเหลว!", error.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    } finally {
      setLoading(false);
    }
  };



  const handleRejectbilling = async () => {
    try {
      setLoading(true);

      // เลือก row ที่ถูก select
      const payload = dataSource.filter((item) => selectedKeys.includes(item.key)).map((item) => ({
        invoiceNo: item.invoiceno,
        remark: item.remark || ""
      }));

      await service.Rejectbilling({
        invoiceNos: payload.map((p) => p.invoiceNo),
        remarks: payload.map((p) => p.remark),
        issuedBy: auth.incharge.trim(),
        documentNo: invoiceDetail?.documentno
      });

      Swal.fire("สำเร็จ!", "เอกสารถูก Reject เรียบร้อยแล้ว", "success");

      refreshData();
      onClose();
    } catch (error: any) {
      console.error(error);
      Swal.fire("ล้มเหลว!", error.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    } finally {
      setLoading(false);
    }
  };


  const handleCancelbilling = async () => {
    try {
      setLoading(true);

      // เลือก row ที่ถูก select
      const payload = dataSource.filter((item) => selectedKeys.includes(item.key)).map((item) => ({
        invoiceNo: item.invoiceno,
        remark: item.remark || ""
      }));

      await service.CancelBilling({
        invoiceNos: payload.map((p) => p.invoiceNo),
        remarks: payload.map((p) => p.remark),
        issuedBy: auth.incharge.trim(),
        documentNo: invoiceDetail?.documentno
      });

      Swal.fire("สำเร็จ!", "เอกสารถูก Cancel เรียบร้อย", "success");

      refreshData();
      onClose();
    } catch (error: any) {
      console.error(error);
      Swal.fire("ล้มเหลว!", error.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    } finally {
      setLoading(false);
    }
  };


  const handlePrint = () => {
    setIsDetailModalOpen(true);
  };


  const BLOCK_STATUSES = ["REJECT", "CONFIRM", "CANCEL", "PAYMENT", "CANCEL_PAYMENT"];


  const hasRejectOrConfirm = dataSource.some(item =>
    BLOCK_STATUSES.includes(item.status)
  );



  const hasReject = dataSource.some(item => item.status === "CONFIRM" || item.status === "CANCEL_PAYMENT" || item.status === "PAYMENT");

  return (
    <Modal
      title={
        <div
          style={{
            textAlign: "center",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          Details Billing No : {invoiceDetail ? invoiceDetail.documentno : ""}
        </div>
      }
      open={open}
      onCancel={() => {
        setSelectedKeys([]);
        onClose();
      }}
      footer={null}
      width={1800}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "max-content", y: 600 }}
        tableLayout="fixed"
        sticky
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />



      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          type="primary"
          style={{
            backgroundColor: "#0098ff",
            borderColor: "#0098ff",
            color: "white",
            width: 140,
            height: 34,
            fontSize: 16,
          }}
          onClick={handlePrint}
        >
          Print Report
        </Button>


        {/* Left */}
        {selectedKeys.length > 0 && (
          <>
            {/* Right */}
            <div style={{ display: "flex", gap: 8 }}>
              {/* Reject */}
              {!hasReject && (
                <Button
                  danger
                  type="primary"
                  style={{
                    backgroundColor: "red",
                    borderColor: "red",
                    color: "white",
                    width: 100,
                    height: 34,
                    fontSize: 16,
                  }}
                  onClick={handleRejectbilling}
                >
                  Reject
                </Button>
              )}



              {/* Cancel */}
              {dataSource[0]?.status === "CONFIRM" || dataSource[0]?.status === "CANCEL_PAYMENT" && (
                <Button
                  danger
                  type="primary"
                  style={{
                    backgroundColor: "red",
                    borderColor: "red",
                    color: "white",
                    width: 100,
                    height: 34,
                    fontSize: 16,
                  }}
                  onClick={handleCancelbilling}
                >
                  Cancel
                </Button>
              )}

              {/* Confirm */}
              {!hasRejectOrConfirm && (
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a",
                    color: "white",
                    width: 100,
                    height: 34,
                    fontSize: 16,
                  }}
                  onClick={handleconfirmbilling}
                >
                  Confirm
                </Button>
              )}
            </div>
          </>
        )}
      </div>


      <EBilling_ConfirmACDetailPrint
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        invoiceDetail={dataSource}
        refreshData={fetchData}
      />

    </Modal>
  );
};

export default EBilling_ConfirmACModalDetail;
