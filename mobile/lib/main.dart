import 'package:flutter/material.dart';
import 'package:mobile/navigation/router.dart';
import 'package:go_router/go_router.dart';

void main() {
  final GoRouter router = appRouter;

  runApp( MyApp(router :router,));
}

class MyApp extends StatefulWidget {
  final GoRouter router;
  const MyApp({super.key, required this.router});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    return  MaterialApp.router(
      routerConfig: widget.router,
    );
  }
}
