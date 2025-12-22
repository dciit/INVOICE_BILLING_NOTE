//@ts-nocheck
import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Divider, Table, Select } from "antd";
import { FileProtectOutlined, SearchOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import service from "../../service/confirm.service";
import { useSelector } from "react-redux";
import "../../css/InvoiceConfirm.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import EBilling_DetailModalAC from "../modal/EBilling_DetailModalAC";
import EBilling_DetailModalACPrint from "../modal/EBilling_DetailModalACPrint";


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

export default function EBilling_ReportAC() {
    const auth = useSelector((state: any) => state.reducer.authen);
    const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
    const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
    const [dataSource, setDataSource] = useState<InvoiceDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDetailModalOpenDetail, setIsDetailModalOpenDetail] = useState(false);
    const [isDetailModalOpenPrint, setIsDetailModalOpenPrint] = useState(false);
    const [detailRecordDetail, setDetailRecordDetail] = useState<InvoiceDetail | null>(null);
    const [detailRecordPrint, setDetailRecordPrint] = useState<InvoiceDetail | null>(null);
    const [status, setStatus] = useState<string>("%");

    useEffect(() => {
        fetchData();
    }, [auth.username]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await service.PostReportACHeader({ status: "%", role: auth.role });
            const mappedData = res.data.map((item: any, index: number) => ({ ...item, key: index }));
            setDataSource(mappedData);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onSearchByDate = async () => {
        if (!fromDate || !toDate) {
            Swal.fire({ icon: "warning", title: "Please select Document dates." });
            return;
        }

        try {
            setLoading(true);
            const res = await service.PostReportACHeader({
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
                        setDetailRecordDetail(record);
                        setIsDetailModalOpenDetail(true);
                    }}
                />
            )
        },
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



    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <FileProtectOutlined style={{ fontSize: 28, marginRight: 10, color: "#1890ff" }} />
                <p style={{ fontWeight: 600, fontSize: 20 }}>Report</p>
            </div>

            <Divider style={{ borderColor: "#d0cdcd", marginTop: 8 }} />

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <Form layout="inline">
                    <span style={{ marginRight: 10, fontWeight: 500, fontSize: 16 }}>Invoice Date</span>

                    <span style={{ marginRight: 10 }}>From :</span>
                    <Form.Item>
                        <DatePicker format="DD/MM/YYYY" value={fromDate} onChange={setFromDate} style={{ height: 40 }} />
                    </Form.Item>

                    <span style={{ margin: "0 10px" }}>To :</span>
                    <Form.Item>
                        <DatePicker format="DD/MM/YYYY" value={toDate} onChange={setToDate} style={{ height: 40 }} />
                    </Form.Item>

                    <span style={{ margin: "0 10px" }}>Status :</span>
                    <Form.Item>
                        <Select value={status} onChange={setStatus} style={{ width: 220, height: 40 }}>
                            <Option value="%">All</Option>
                            <Option value="WAITING">Waiting Confirm</Option>
                            <Option value="CONFIRM">RECEIVE</Option>
                            <Option value="REJECT">REJECT</Option>
                            <Option value="PAYMENT">PAYMENT</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={onSearchByDate} loading={loading} style={{ height: 40 }}>
                            Search
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button type="default" onClick={exportPDF} style={{
                            backgroundColor: "#52c41a",
                            borderColor: "#52c41a",
                            height: 38,
                            color: "white"
                        }}>
                            Export PDF
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
                    summary={() => (
                        <Table.Summary fixed="bottom">
                            <Table.Summary.Row style={{ backgroundColor: "#fafafa", fontWeight: 700 }}>
                                <Table.Summary.Cell colSpan={5} align="center">Grand Total</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalAmount()}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalWHTax()}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right">{getGrandTotalNetPaid()}</Table.Summary.Cell>
                                <Table.Summary.Cell ></Table.Summary.Cell>
                                <Table.Summary.Cell ></Table.Summary.Cell>
                                <Table.Summary.Cell ></Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>

            <EBilling_DetailModalAC
                open={isDetailModalOpenDetail}
                onClose={() => setIsDetailModalOpenDetail(false)}
                invoiceDetail={detailRecordDetail}
                refreshData={onSearchByDate}
            />


            <EBilling_DetailModalACPrint
                open={isDetailModalOpenPrint}
                onClose={() => setIsDetailModalOpenPrint(false)}
                invoiceDetail={detailRecordPrint}
            />
        </div>
    );
}
