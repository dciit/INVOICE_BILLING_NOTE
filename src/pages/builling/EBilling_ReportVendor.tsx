//@ts-nocheck
import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Divider, Table, Select } from "antd";
import { FileProtectOutlined, PrinterOutlined, SearchOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import service from "../../service/confirm.service";
import { useSelector } from "react-redux";
import "../../css/InvoiceConfirm.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import EBilling_DetailModalVendor from "../modal/EBilling_DetailModalVendor";
import EBilling_DetailModalVendorPrint from "../modal/EBilling_DetailModalVendorPrint";

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
    const [status, setStatus] = useState<string>("WAITING");
    const [dataSource, setDataSource] = useState<InvoiceDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDetailModalOpenPrint, setIsDetailModalOpenPrint] = useState(false);
    const [detailRecord, setDetailRecord] = useState<InvoiceDetail | null>(null);

    useEffect(() => {
        fetchData();
    }, [auth.username]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await service.PostReportACAndVendorHeader({
                venderCode: auth.username, status: "WAITING", role: auth.role, invoiceDateFrom: fromDate.format("YYYY-MM-DD"),
                invoiceDateTo: toDate.format("YYYY-MM-DD")
            });
            const mappedData = res.data.map((item: any, index: number) => ({ ...item, key: index }));
            setDataSource(mappedData);
            console.log(res.data)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onSearchByDateAndStatus = async () => {
        if (!fromDate || !toDate) {
            Swal.fire({ icon: "warning", title: "Please select Document dates." });
            return;
        }

        try {
            setLoading(true);
            const res = await service.PostReportACAndVendorHeader({
                venderCode: auth.username,
                invoiceDateFrom: fromDate.format("YYYY-MM-DD"),
                invoiceDateTo: toDate.format("YYYY-MM-DD"),
                status: status,
                role: auth.role
            });
            const filteredData = res.data

            setDataSource(filteredData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: "No", width: 60, align: "center", render: (_: any, __: any, index: number) => index + 1 },
        { title: "DUE DATE", dataIndex: "duedate", width: 120, align: "center" },
        { title: "TAX ID", dataIndex: "taxid", width: 150, align: "center" },
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
        { title: "STATUS", dataIndex: "status", width: 100, align: "center" },
        {
            title: "Detail",
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
            title: "Print",
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
                    {auth?.role === "rol_accountant" ? "E-Billing" : "E-Billing"}
                </p>
            </div>

            <Divider style={{ borderColor: "#d0cdcd", marginTop: 8 }} />

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <Form layout="inline" style={{ alignItems: "center" }}>

                    <Form.Item
                        style={{ marginRight: 10, fontSize: 16, fontWeight: 500, height: 40, display: "flex", alignItems: "center" }}
                    >
                        Invoice Date
                    </Form.Item>

                    <Form.Item
                        style={{ marginRight: 5, height: 40, display: "flex", fontWeight: 500, alignItems: "center" }}
                    >
                        From :
                    </Form.Item>

                    <Form.Item>
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={fromDate}
                            onChange={setFromDate}
                            style={{ height: 40 }}
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ margin: "0 5px", height: 40, display: "flex", fontWeight: 500, alignItems: "center" }}
                    >
                        To :
                    </Form.Item>

                    <Form.Item>
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={toDate}
                            onChange={setToDate}
                            style={{ height: 40 }}
                        />
                    </Form.Item>

                    <Form.Item
                        style={{ margin: "0 5px", height: 40, display: "flex", fontWeight: 500, alignItems: "center" }}
                    >
                        Status :
                    </Form.Item>

                    <Form.Item>
                        <Select
                            value={status}
                            onChange={setStatus}
                            style={{ width: 180, height: 40 }}
                        >
                            <Select.Option value="%">All</Select.Option>
                            <Select.Option value="WAITING">WAITING CONFIRM</Select.Option>
                            <Select.Option value="CONFIRM">CONFIRM</Select.Option>
                            <Select.Option value="REJECT">REJECT</Select.Option>
                            <Select.Option value="PAYMENT">PAYMENT</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            onClick={onSearchByDateAndStatus}
                            loading={loading}
                            style={{ height: 40 }}
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
                                <Table.Summary.Cell colSpan={5} align="center">Grand Total</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalAmount()}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalWHTax()}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalNetPaid()}</Table.Summary.Cell>
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
                refreshData={onSearchByDateAndStatus}
            />

            <EBilling_DetailModalVendorPrint
                open={isDetailModalOpenPrint}
                onClose={() => setIsDetailModalOpenPrint(false)}
                invoiceDetail={detailRecord}
                refreshData={onSearchByDateAndStatus}
            />
        </div>
    );
}
