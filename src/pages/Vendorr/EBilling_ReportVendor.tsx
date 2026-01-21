
import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Divider, Table, Select } from "antd";
import { FileProtectOutlined, PrinterOutlined, SearchOutlined, LinkOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import service from "../../service/confirm.service";
import { useSelector } from "react-redux";
import "../../css/InvoiceConfirm.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import EBilling_DetailModalVendor from "./EBilling_DetailModalVendor";
import EBilling_DetailModalVendorPrint from "./EBilling_DetailModalVendorPrint";
import EBilling_AttachFileModal from "./EBilling_AttachFileModal";

dayjs.extend(isBetween);

const { Option } = Select;

interface InvoiceDetail {
    key: React.Key;
    address: string;
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
    status: string; // เพิ่ม field status
    invoicedate: string;
    invoiceno: string;
}

export default function EBilling_ReportVendor() {
    const auth = useSelector((state: any) => state.reducer.authen);
    const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().startOf("month"));
    const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
    const [status, setStatus] = useState<string>("%");
    const [dataSource, setDataSource] = useState<InvoiceDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDetailModalOpenPrint, setIsDetailModalOpenPrint] = useState(false);
    const [isAttachFileModalOpen, setIsAttachFileModalOpen] = useState(false);
    const [detailRecord, setDetailRecord] = useState<InvoiceDetail | null>(null);
    const [documentNo, setDocumentNo] = useState("");


    useEffect(() => {
        fetchData();
    }, [auth.username]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await service.PostReportVendorHeader({
                venderCode: auth.username, status: "WAITING", role: auth.role, invoiceDateFrom: fromDate.format("YYYY-MM-DD"),
                invoiceDateTo: toDate.format("YYYY-MM-DD"), documentNo: '%'
            });
            const mappedData = res.data.map((item: any, index: number) => ({ ...item, key: index }));
            setDataSource(mappedData);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onSearch = async () => {
        if (!fromDate || !toDate) {
            Swal.fire({ icon: "warning", title: "Please select Document dates." });
            return;
        }

        try {
            setLoading(true);
            const res = await service.PostReportVendorHeader({
                venderCode: auth.username,
                invoiceDateFrom: fromDate.format("YYYY-MM-DD"),
                invoiceDateTo: toDate.format("YYYY-MM-DD"),
                status: status,
                role: auth.role,
                documentNo: documentNo ? documentNo : '%'
            });
            const filteredData = res.data

            setDataSource(filteredData);

            console.log(filteredData)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const deleteDocumentNo = async (record: InvoiceDetail) => {
        const canDelete =
            record.status === "WAITING_DCI" || record.status === "REJECT";

        if (!canDelete) {
            Swal.fire({
                icon: "warning",
                title: "ไม่สามารถลบได้",
                text: "สามารถลบได้เฉพาะสถานะ WAITING_DCI หรือ REJECT เท่านั้น",
            });
            return;
        }

        const result = await Swal.fire({
            title: "ยืนยันการลบ",
            text: `คุณต้องการลบเอกสารหมายเลข ${record.documentno} หรือไม่?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#d33",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await service.PostDeleteDocumentNo({
                documentNo: record.documentno,
            });

            if (res.status === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "ลบสำเร็จ",
                    text: res.data.message,
                    timer: 2000,
                    showConfirmButton: false,
                });

                onSearch(); // 🔁 refresh table
            } else {
                Swal.fire({
                    icon: "error",
                    title: "ลบไม่สำเร็จ",
                    text: "ไม่สามารถลบเอกสารได้",
                });
            }
        } catch (error: any) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text:
                    error?.response?.data?.message ||
                    "เกิดข้อผิดพลาดในการลบไฟล์",
            });
        }
    };





    const columns = [
        { title: "No", width: 60, align: "center", render: (_: any, __: any, index: number) => index + 1 },
        { title: "DOCUMENT NO", dataIndex: "documentno", width: 120, align: "center" },
        // { title: "INVOICE NO", dataIndex: "invoiceno", width: 120, align: "center" },
        // { title: "INVOICE DATE", dataIndex: "invoicedate", width: 120, align: "center" },
        // {
        //     title: "DUE DATE",
        //     dataIndex: "duedate",
        //     width: 120,
        //     align: "center",
        //     render: (_: any, record: InvoiceDetail) =>
        //         record.duedate ? record.duedate : null
        // },
        { title: "TAX ID", dataIndex: "taxid", width: 150, align: "center" },
        { title: "VENDOR CODE", dataIndex: "vendorcode", width: 150, align: "center" },
        { title: "VENDOR NAME", dataIndex: "vendorname", width: 260, align: "left" },
        { title: "PAYMENT TERMS", dataIndex: "paymenT_TERMS", width: 120, align: "center" },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "totaL_AMOUNT",
            width: 150,
            align: "right",
            render: (val: any) => Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 }),
        },
        {
            title: "W/H TAX",
            dataIndex: "whtax",
            width: 120,
            align: "right",
            render: (val: any) => Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 }),
        },
        {
            title: "NET PAID",
            dataIndex: "netpaid",
            width: 150,
            align: "right",
            render: (val: any) => Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 }),
        },
        {
            title: "STATUS",
            dataIndex: "status",
            width: 110,
            align: "center",
            render: (value: string) => {
                if (!value) return "-";

                if (value === "WAITING_VENDOR") return "Waiting Vendor Confirm";
                if (value === "WAITING_DCI") return "Waiting DCI Confirm";



                return value; // อื่น ๆ แสดงตามเดิม
            },
        },
        {
            title: "DETAIL",
            width: 80,
            align: "center",
            render: (_: any, record: InvoiceDetail) => (
                <SearchOutlined
                    style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                    onClick={() => {
                        setDetailRecord(record);
                        setIsDetailModalOpen(true);
                    }}
                />
            )
        },
        {
            title: "PRINT",
            width: 80,
            align: "center",
            render: (_: any, record: InvoiceDetail) => (
                <PrinterOutlined
                    style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                    onClick={() => {
                        setDetailRecord(dataSource);
                        setIsDetailModalOpenPrint(true);
                    }}
                />
            )
        },
        {
            title: "ATTACH FILE",
            width: 50,
            align: "center",
            render: (_: any, record: InvoiceDetail) => (
                <LinkOutlined
                    style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                    onClick={() => {
                        setDetailRecord(dataSource);
                        setIsAttachFileModalOpen(true);
                    }}
                />
            )
        },
        {
            title: "DELETE",
            width: 50,
            align: "center",
            render: (_: any, record: InvoiceDetail) => {
                const canDelete =
                    record.status === "WAITING_DCI" || record.status === "REJECT";

                return (
                    <DeleteOutlined
                        style={{
                            fontSize: 25,
                            color: canDelete ? "#ff0000" : "#ccc",
                            cursor: canDelete ? "pointer" : "not-allowed",
                            transition: "transform 0.2s, color 0.2s"
                        }}
                        onMouseEnter={e => {
                            if (canDelete) e.currentTarget.style.color = "#cc0000";
                        }}
                        onMouseLeave={e => {
                            if (canDelete) e.currentTarget.style.color = "#ff0000";
                        }}
                        onClick={() => deleteDocumentNo(record)}
                    />
                );
            }
        }

    ];


    const getGrandTotalAmount = () => dataSource.reduce((sum, item) => sum + Number(item.totaL_AMOUNT ?? 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const getGrandTotalWHTax = () => dataSource.reduce((sum, item) => sum + Number(item.whtax ?? 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const getGrandTotalNetPaid = () => dataSource.reduce((sum, item) => sum + Number(item.netpaid ?? 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <FileProtectOutlined style={{ fontSize: 28, marginRight: 10, color: "#1890ff" }} />
                <p style={{ fontWeight: 600, fontSize: 20, margin: 0 }}>
                    Report
                </p>
            </div>

            <Divider style={{ borderColor: "#d0cdcd", marginTop: 8 }} />

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <Form layout="inline" style={{ alignItems: "center" }}>

                    <Form.Item
                        style={{ marginRight: 10, fontSize: 14, fontWeight: 500, height: 32, display: "flex", alignItems: "center" }}
                    >
                        Invoice Date
                    </Form.Item>

                    <Form.Item
                        style={{ marginRight: 5, height: 32, display: "flex", fontWeight: 500, alignItems: "center" }}
                    >
                        From :
                    </Form.Item>

                    <Form.Item>
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={fromDate}
                            onChange={setFromDate}
                            style={{ height: 32, width: 150 }}
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ margin: "0 5px", height: 32, display: "flex", fontWeight: 500, alignItems: "center" }}
                    >
                        To :
                    </Form.Item>

                    <Form.Item>
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={toDate}
                            onChange={setToDate}
                            style={{ height: 32, width: 150 }}
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ margin: "0 5px", height: 32, display: "flex", fontWeight: 500, alignItems: "center" }}
                    >
                        Status :
                    </Form.Item>

                    <Form.Item>
                        <Select value={status} onChange={setStatus} style={{ width: 200, height: 32 }}>
                            <Option value="%">All</Option>
                            <Option value="WAITING_VENDOR">Waiting Vendor Confirm</Option>
                            <Option value="WAITING_DCI">Waiting DCI Confirm</Option>
                            <Option value="CONFIRM">Confirm</Option>
                            <Option value="REJECT">Reject</Option>
                            <Option value="PAYMENT">Payment</Option>
                        </Select>
                    </Form.Item>

                    <span style={{ margin: "0 10px", fontWeight: 500, fontSize: 14 }}>Document No :</span>
                    <Form.Item>
                        <input
                            type="text"
                            value={documentNo}
                            onChange={(e) => setDocumentNo(e.target.value)}
                            style={{ width: 250, height: 32, padding: "0 10px", borderRadius: 4, border: "1px solid #d9d9d9" }}
                        />
                    </Form.Item>

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
                        return "";
                    }}
                    summary={() => (
                        <Table.Summary fixed="bottom">
                            <Table.Summary.Row style={{ backgroundColor: "#fafafa", fontWeight: 700 }}>
                                <Table.Summary.Cell colSpan={6} align="center">Grand Total</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalAmount()}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalWHTax()}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalNetPaid()}</Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>

            <EBilling_DetailModalVendor
                open={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                invoiceDetail={detailRecord}
                refreshData={onSearch}
            />

            <EBilling_DetailModalVendorPrint
                open={isDetailModalOpenPrint}
                onClose={() => setIsDetailModalOpenPrint(false)}
                invoiceDetail={detailRecord}
                refreshData={onSearch}
            />


            <EBilling_AttachFileModal
                open={isAttachFileModalOpen}
                onClose={() => setIsAttachFileModalOpen(false)}
                invoiceDetail={detailRecord}
                refreshData={onSearch}
            />
        </div>
    );
}
